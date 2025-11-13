const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/authMiddleware");
const User = require("../models/User");

// PROFILE PAGE - show current user's profile
router.get("/", ensureAuth, async (req, res) => {
  try {
    // use .lean() to get plain object and avoid Mongoose getters surprises
    const user = await User.findById(req.session.userId).select("-password -__v").lean();
    if (!user) return res.redirect("/login");

    // safe joinedOn value for the view
    const joinedOn = user.createdAt ? new Date(user.createdAt).toDateString() : "Unknown";

    res.render("profile", { user, joinedOn });
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).render("404", { message: "Failed to load profile" });
  }
});

module.exports = router;
