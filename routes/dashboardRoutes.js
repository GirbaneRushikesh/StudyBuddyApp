const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const Note = require("../models/Note");

router.get("/", ensureAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { tag, q } = req.query;
    const filter = { user: userId };

    if (tag) filter.tags = tag;
    if (q) {
      // simple case-insensitive substring search across title/content
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ];
    }

    const notes = await Note.find(filter).sort({ updatedAt: -1 }).lean();
    const total = notes.length;
    const revised = notes.filter(n => n.revised).length;
    const username = req.session.username || "User";

    res.render("dashboard", { notes, username, total, revised, tag: tag || null, q: q || null });
  } catch (err) {
    console.error("Dashboard error:", err);
    req.session.error_msg = "Failed to load dashboard";
    res.redirect("/login");
  }
});

module.exports = router;
