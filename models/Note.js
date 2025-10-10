const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Category (user-defined)
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    // Tags for flexible filtering
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Optional AI or mock summary
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    // Array of file attachments
    attachments: [
      {
        filename: String,
        filePath: String, // e.g. "/uploads/notes/abc123.pdf"
        fileType: String, // e.g. "application/pdf" or "image/png"
      },
    ],
    // Revision tracking
    revised: {
      type: Boolean,
      default: false,
    },
    revisedAt: {
      type: Date,
      default: null,
    },
    // Optional: compiling multiple notes
    compiledGroup: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster filtering
noteSchema.index({ user: 1, category: 1, tags: 1 });

// Automatically update revisedAt when revised flips
noteSchema.pre("save", function (next) {
  if (this.isModified("revised")) {
    this.revisedAt = this.revised ? new Date() : null;
  }
  next();
});

module.exports = mongoose.model("Note", noteSchema);
