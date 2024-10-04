const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  image: { data: Buffer, contentType: String },
  likes: { type: Number },
  createdBy: { type: String },
  inGroup: { type: Boolean, required: true },
  groupId: { type: String },
  user: { type: Object },
  comments: [],
});

const Feed = mongoose.model("Feed", feedSchema);
module.exports = Feed;
