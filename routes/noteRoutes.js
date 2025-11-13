const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const { ensureAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Render create form
router.get("/create", ensureAuth, (req, res) => {
  res.render("notes/new", { note: null });
});

// Render edit form
router.get("/:id/edit", ensureAuth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      req.session.error_msg = "Note not found";
      return res.redirect("/dashboard");
    }
    res.render("notes/edit", { note });
  } catch (err) {
    console.error("Error loading edit form:", err);
    req.session.error_msg = "Failed to load note editor";
    res.redirect("/dashboard");
  }
});

// Create (form)
router.post("/form/create", ensureAuth, upload.array("attachments", 5), async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const attachments = req.files ? req.files.map(f => ({ filename: f.originalname, filePath: `/uploads/${f.filename}`, fileType: f.mimetype })) : [];
    const note = new Note({
      user: req.session.userId,
      title: title || "Untitled",
      content: content || "",
      category: category || "General",
      tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      attachments
    });
    await note.save();
    req.session.success_msg = "Note created successfully";
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Create note error:", err);
    req.session.error_msg = "Failed to create note";
    res.redirect("/dashboard");
  }
});

// Update (form)
router.post("/form/update/:id", ensureAuth, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      req.session.error_msg = "Note not found";
      return res.redirect("/dashboard");
    }
    note.title = title || note.title;
    note.content = content || note.content;
    note.category = category || note.category;
    note.tags = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
    await note.save();
    req.session.success_msg = "Note updated successfully";
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Update note error:", err);
    req.session.error_msg = "Failed to update note";
    res.redirect("/dashboard");
  }
});

// Delete (form)
router.post("/form/delete/:id", ensureAuth, async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.session.userId });
    req.session.success_msg = "Note deleted";
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Delete note error:", err);
    req.session.error_msg = "Failed to delete note";
    res.redirect("/dashboard");
  }
});

// Toggle revised (form)
router.post("/form/toggle/:id", ensureAuth, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.session.userId });
    if (!note) {
      req.session.error_msg = "Note not found";
      return res.redirect("/dashboard");
    }
    note.revised = !note.revised;
    await note.save();
    req.session.success_msg = note.revised ? "Marked as revised" : "Unmarked as revised";
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Toggle revised error:", err);
    req.session.error_msg = "Failed to update note";
    res.redirect("/dashboard");
  }
});

module.exports = router;
