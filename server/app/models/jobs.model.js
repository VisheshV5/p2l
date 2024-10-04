const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Title is required"],
    maxlength: 70,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"],
  },
  salary: { type: String, trim: true, required: [true, "Salary is required"] },
  location: { type: String },
  available: { type: Boolean, default: true },
  jobType: { type: String },
  position: { type: String },
  user: { type: ObjectId, required: true },
  applicants: [
    {
      user: {},
      userId: { type: ObjectId, ref: "User" },
      resume: { type: String },
      coverLetter: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined"],
        default: "Pending",
      },
    },
  ],
  skills: [],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", jobSchema);
