const zod = require("zod");
const { User } = require("../models/user-model");
const { Account } = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const signupBody = zod.object({
  username: zod.string().email(),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

const signup = async (req, res) => {
  try {
    // console.log(secret);
    const { success } = signupBody.safeParse(req.body);
    // console.log(success);
    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser) {
      return res.status(411).json({
        message: "Email already taken/Incorrect inputs",
      });
    }

    const user = await User.create(req.body);
    await Account.create({
      userId: user._id,
      balance: 1 + Math.random() * 10000,
    });
    const userId = user._id;
    const token = jwt.sign({ userId }, secret);

    return res.status(200).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Email already taken / Incorrect inputs",
      err: error,
    });
  }
};

const signin = async (req, res) => {
  try {
    signinBody.parse(req.body);
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign({ userId: user._id }, secret);
      return res.status(200).json({
        token: token,
      });
    } else {
      return res.status(411).json({
        message: "Error while logging in",
      });
    }
  } catch (error) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    updateBody.parse(req.body);
    const user = await User.findByIdAndUpdate(req.userId, req.body);
    res.status(200).json({
      msg: "User Updated Successfully",
    });
  } catch (error) {
    res.status(411).json({
      msg: "Error while updating information",
      err: error,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });
  } catch (error) {
    res.status(400).json({
      err: error,
    });
  }
};

module.exports = { signup, signin, updateUserInfo, getUser };
