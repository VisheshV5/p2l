const controller = require("../controllers/groups.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/groups/create/:userId", controller.createGroup);
  app.get("/api/groups", controller.getAllGroups);
  app.get("/api/groups/:groupId", controller.getGroupById);
  app.get("/api/groups/feed/:groupId", controller.getFeedForGroup);
  app.post("/api/groups/join/:groupId", controller.joinGroup);
};
