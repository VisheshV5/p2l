const db = require("../models");
const Feed = db.feed;
const User = db.user;

const getAllFeed = async (req, res) => {
  try {
    const feed = await Feed.find().exec();
    res.json({ feed });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const createFeed = async (req, res) => {
  const { title, description, inGroup, groupId, user } = req.body;
  console.log("DFSoSHJDFKDHJFSDFKS", req.body);

  try {
    const feed = new Feed({
      title,
      description,
      inGroup,
      groupId,
      createdBy: req.params.userId,
      user: { user },
    });

    await feed.save();
    console.log("DONE");
    res.send({ message: "Feed created successfully!", feedId: feed._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const makeComment = async (req, res) => {
  const feedId = req.params.feedId;
  const userId = req.body.userId;
  const comment = req.body.comment;
  const date = Date.now();

  try {
    const feed = await Feed.findById(feedId).exec();
    const user = await User.findById(userId);
    console.log(user);
    feed.comments.unshift({ user, comment, date });
    feed.save();

    if (!feed) {
      return res.status(404).json({ error: "Comment not posted" });
    }

    res.json({ message: feed });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  getAllFeed,
  createFeed,
  makeComment,
};
