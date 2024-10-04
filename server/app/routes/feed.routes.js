const controller = require("../controllers/feed.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/feed/create/:userId", controller.createFeed);

  app.get("/api/feed", controller.getAllFeed);
  app.post("/api/feed/comment/:feedId", controller.makeComment);
};
