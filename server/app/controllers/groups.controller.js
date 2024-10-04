const db = require("../models");
const Group = db.group;
const Comment = db.comment;
const Feed = db.feed;
const User = db.user;

const createGroup = async (req, res) => {
  const { title, description, banner, members } = req.body;
  let retryCount = 3;
  console.log(banner);
  try {
    const group = new Group({
      title: title,
      description: description,
      banner: banner,
      members: members,
      createdBy: req.params.userId,
    });

    await group.save();
    res.send({ message: group._id });

    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
    return;
  }
};



const getAllGroups = async (req, res, next) => {
  try {
    const groups = await Group.find().exec();
    res.json({ groups });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const getGroupById = async (req, res) => {
  const { groupId } = req.params;
  console.log(groupId);

  try {
    const group = await Group.findById(groupId).exec();

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: group });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const getFeedForGroup = async (req, res) => {
  const groupId = req.params.groupId;
  try {
    const feed = await Feed.find({ groupId: groupId }).exec();
    console.log(feed);
    res.json({ feed });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const joinGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.body.userId;

  try {
    const group = await Group.findById(groupId).exec();
    const user = await User.findById(userId);
    console.log(user);
    group.members.push(user);
    group.save();

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.json({ message: group });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  getGroupById,
  getFeedForGroup,
  joinGroup,
};
