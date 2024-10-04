const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.feed = require("./feed.model");
db.job = require("./jobs.model");
db.comment = require("./comment.model");
db.group = require("./group.model");
db.preference = require("./preferences.model");

module.exports = db;
