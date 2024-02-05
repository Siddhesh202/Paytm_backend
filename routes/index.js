const express = require("express");
const userRouter = require("./user-router");
const accountRouter = require("./account-router");
const router = express.Router();

router.use("/user", userRouter);
router.use("/account", accountRouter);
module.exports = router;
