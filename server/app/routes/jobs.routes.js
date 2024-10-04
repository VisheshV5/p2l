const controller = require("../controllers/jobs.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/jobs/create/:userId", controller.createJob);
  app.get("/api/jobs/:jobId", controller.getJobById);
  app.get("/api/jobs", controller.getAllJobs);
  app.post("/api/jobs/apply/:jobId", controller.applyToJob);
  app.post("/api/jobs/:jobId/accept/:userId", controller.acceptUser);
  app.post("/api/jobs/:jobId/decline/:userId", controller.declineUser);
};
