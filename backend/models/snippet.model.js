const mongoose = require("mongoose");

const snippetSchema = new mongoose.Schema({
  title: String,
  language: String,
  code: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Snippet", snippetSchema);
