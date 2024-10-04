const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
  },
  feedId: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const Comment = model("comment", commentSchema);

module.exports = Comment;
