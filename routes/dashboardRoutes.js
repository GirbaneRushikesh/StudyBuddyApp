const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const { getUserNotes } = require("../controllers/noteController");

// ✅ Dashboard page (protected)
router.get("/", ensureAuth, async (req, res) => {
  try {
    const username = req.session.username || "Guest";
    const notes = await getUserNotes(req.session.userId);
    res.render("dashboard", { username, notes });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.render("dashboard", { username: req.session.username || "Guest", notes: [] });
  }
});

module.exports = router;
