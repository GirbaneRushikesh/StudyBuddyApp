const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const { getUserNotes } = require("../controllers/noteController");

// DASHBOARD
router.get("/", ensureAuth, async (req, res) => {
  try {
    const notes = await getUserNotes(req.session.userId);
    const username = req.session.username || "User";
    // compute progress for UI
    const total = notes.length;
    const revised = notes.filter(n => n.revised).length;
    res.render("dashboard", { notes, username, total, revised });
  } catch (err) {
    console.error(err);
    req.session.error_msg = "Failed to load dashboard";
    res.redirect("/login");
  }
});

module.exports = router;
