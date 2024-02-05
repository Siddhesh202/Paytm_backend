const express = require("express");
const {
  signup,
  signin,
  updateUserInfo,
  getUser,
} = require("../controllers/user-controller");
const { authMiddleware } = require("../middlewares/auth-middleware");

const router = express.Router();
router.post("/signup", signup);
router.post("/signin", signin);
router.put("/", authMiddleware, updateUserInfo);
router.get("/bulk", getUser);

module.exports = router;
