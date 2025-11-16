const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Note = require("../models/Note");

// Public pages
router.get("/about", (req, res) => res.render("pages/about", { title: "About", username: req.session.username }));
router.get("/features", (req, res) => res.render("pages/features", { title: "Features", username: req.session.username }));
router.get("/support", (req, res) => res.render("pages/support", { title: "Support", username: req.session.username }));

// tags - show and let user add tags
router.get("/tags", ensureAuth, async (req, res) => {
  const u = await User.findById(req.session.userId).lean();
  const tags = u?.tags || [];
  res.render("pages/tags", { title: "Tags", username: req.session.username, tags, user: u });
});

router.post("/tags", ensureAuth, async (req, res) => {
  try {
    const { tag } = req.body;
    const u = await User.findById(req.session.userId);
    if (!u) return res.redirect("/login");
    const t = (tag || "").trim();
    if (t && !u.tags.includes(t)) { u.tags.push(t); await u.save(); }
    res.redirect("/tags");
  } catch (err) { console.error(err); res.redirect("/tags"); }
});

// settings save (displayName / theme / tags)
router.post("/settings", ensureAuth, async (req, res) => {
  try {
    const { displayName, theme, tags } = req.body;
    const u = await User.findById(req.session.userId);
    if (!u) return res.redirect("/login");
    if (displayName) u.displayName = displayName.trim();
    if (theme) u.settings = u.settings || {}, u.settings.theme = theme;
    if (tags !== undefined) u.tags = tags.split(",").map(t => t.trim()).filter(Boolean);
    await u.save();
    req.session.username = u.displayName || u.username;
    req.session.theme = u.settings.theme || "light";
    req.session.success_msg = "Settings saved";
    res.redirect("/settings");
  } catch (err) { console.error(err); req.session.error_msg = "Failed to save settings"; res.redirect("/settings"); }
});

// analytics - real per-user last 14 days + top tags
router.get("/analytics", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const since = new Date(); since.setDate(since.getDate() - 13); // last 14 days
    const recentNotes = await Note.find({ user: userId, createdAt: { $gte: since } }).lean();

    // daily buckets
    const buckets = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      buckets[d.toISOString().slice(0, 10)] = 0;
    }
    recentNotes.forEach(n => {
      const k = n.createdAt.toISOString().slice(0, 10);
      if (buckets[k] !== undefined) buckets[k] += 1;
    });
    const labels = Object.keys(buckets);
    const data = labels.map(l => buckets[l]);

    // top tags aggregation
    const allNotes = await Note.find({ user: userId }).lean();
    const tagCounts = {};
    allNotes.forEach(n => (n.tags || []).forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1));
    const topTags = Object.entries(tagCounts).sort((a,b)=>b[1]-a[1]).slice(0,8);

    res.render("pages/analytics", { title: "Analytics", username: req.session.username, labels, data, topTags });
  } catch (err) {
    console.error(err);
    res.render("pages/analytics", { title: "Analytics", username: req.session.username, labels: [], data: [], topTags: [] });
  }
});

module.exports = router;