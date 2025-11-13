const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    attachments: [
      {
        filename: String,
        filePath: String,
        fileType: String,
      },
    ],
    revised: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Note || mongoose.model("Note", NoteSchema);
