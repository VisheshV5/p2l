const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signup = (req, res) => {
  const user = new User({
    fName: req.body.fName,
    lName: req.body.lName,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } else {
      res.status(200).send({ message: user._id });
    }
  });
};

const signin = (req, res) => {
  console.log(req.body);
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      fName: user.fName,
      lName: user.lName,

      email: user.email,
    });
  });
};

const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token." });
    }

    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the old password.",
      });
    }

    user.password = bcrypt.hashSync(newPassword, 8);
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiration = null;

    await user.save();

    res.json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,

  signin,
  resetPassword,
};
