const Note = require("../models/Note");
const path = require("path");
const fs = require("fs");

// ==========================
// GET USER NOTES (with optional filters)
exports.getUserNotes = async (userId, filters = {}) => {
  try {
    const query = { user: userId };

    if (filters.category && filters.category !== "All") query.category = filters.category;
    if (filters.tag) query.tags = { $regex: filters.tag, $options: "i" };
    if (filters.revised !== undefined) query.revised = filters.revised;

    const notes = await Note.find(query).sort({ createdAt: -1 });
    return notes;
  } catch (err) {
    console.error("❌ Error fetching notes:", err);
    return [];
  }
};

// ==========================
// CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    // Handle multiple attachments
    const attachments = req.files
      ? req.files.map(f => ({
          filename: f.originalname,
          filePath: `/uploads/${f.filename}`,
          fileType: f.mimetype
        }))
      : [];

    const note = new Note({
      user: req.session.userId,
      title,
      content,
      category: category || "General",
      tags: tags ? tags.split(",").map(t => t.trim()) : [],
      attachments
    });

    await note.save();
    res.status(201).json({ success: true, note });
  } catch (err) {
    console.error("❌ Error creating note:", err);
    res.status(500).json({ success: false, message: "Failed to create note" });
  }
};

// ==========================
// TOGGLE REVISED
exports.toggleRevised = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    note.revised = !note.revised;
    await note.save();

    res.json({ success: true, revised: note.revised });
  } catch (err) {
    console.error("❌ Error toggling revised:", err);
    res.status(500).json({ success: false, message: "Failed to toggle revised" });
  }
};

// ==========================
// DELETE NOTE
exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.session.userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    // Delete attached files from server
    if (note.attachments && note.attachments.length > 0) {
      note.attachments.forEach(file => {
        const filePath = path.join(__dirname, "..", "public", "uploads", path.basename(file.filePath));
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.error("❌ Error deleting note:", err);
    res.status(500).json({ success: false, message: "Failed to delete note" });
  }
};

// ==========================
// MOCK SUMMARIZE NOTES
exports.generateSummary = async (req, res) => {
  try {
    const { noteIds } = req.body;
    if (!noteIds || !Array.isArray(noteIds))
      return res.status(400).json({ success: false, message: "No notes provided" });

    const notes = await Note.find({ _id: { $in: noteIds }, user: req.session.userId });

    const summaries = notes.map(n => ({
      id: n._id,
      summary: n.content.slice(0, 100) + (n.content.length > 100 ? "..." : "")
    }));

    res.json({ success: true, summaries });
  } catch (err) {
    console.error("❌ Error generating summaries:", err);
    res.status(500).json({ success: false, message: "Failed to summarize notes" });
  }
};

// ==========================
// GET PROGRESS DATA
exports.getProgress = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.session.userId });
    const total = notes.length;
    const revised = notes.filter(n => n.revised).length;
    res.json({ success: true, total, revised });
  } catch (err) {
    console.error("❌ Error getting progress:", err);
    res.status(500).json({ success: false, message: "Failed to get progress" });
  }
};
