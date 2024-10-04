const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: [],
  banner: [],
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String },
});

const Group = model("group", groupSchema);

module.exports = Group;
