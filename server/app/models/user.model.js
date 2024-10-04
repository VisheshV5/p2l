const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fName: { type: String },
  lName: { type: String },
  username: { type: String },
  email: { type: String },
  password: { type: String },
  details: {},
  preferences: {},
  profileImage: {
    data: Buffer,
    contentType: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
