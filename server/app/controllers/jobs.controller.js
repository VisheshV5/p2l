const db = require("../models");
const Job = db.job;
const User = db.user;

exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.create({
      title: req.body.title,
      description: req.body.description,
      salary: req.body.salary,
      location: req.body.location,
      user: req.params.userId,
      position: req.body.position,
      jobType: req.body.jobType,
      skills: req.body.skills,
    });
    res.status(201).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.job_id, req.body, {
      new: true,
    }).populate("user", "firstName lastName");
    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().exec();
    res.json({ jobs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.getJobById = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).exec();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({ message: job });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.applyToJob = async (req, res) => {
  const jobId = req.params.jobId;

  const { userId, resume, coverLetter } = req.body;

  try {
    const user = await User.findById(userId);
    const job = await Job.findById(jobId).exec();
    job.applicants.push({ user, userId, resume, coverLetter });
    job.save();

    if (!job) {
      return res.status(404).json({ error: "Couldn't apply to job" });
    }

    res.json({ message: job });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.acceptUser = async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.params.userId;

  try {
    const job = await Job.findById(jobId).exec();

    if (job) {
      const applicant = job.applicants.find(
        (app) => app.userId.toString() === userId
      );
      if (applicant) {
        applicant.status = "Accepted";
        await job.save();
        res.status(200).json({ message: "Application accepted", job });
      } else {
        res.status(404).send("Applicant not found");
      }
    } else {
      res.status(404).send("Job not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

exports.declineUser = async (req, res) => {
  const jobId = req.params.jobId;
  const userId = req.params.userId;

  try {
    const job = await Job.findById(jobId).exec();

    if (job) {
      const applicant = job.applicants.find(
        (app) => app.userId.toString() === userId
      );
      if (applicant) {
        applicant.status = "Declined";
        await job.save();
        res.status(200).json({ message: "Application declined", job });
      } else {
        res.status(404).send("Applicant not found");
      }
    } else {
      res.status(404).send("Job not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
