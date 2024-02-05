const express = require("express");
const {
    getBalance,
    transferMoney,
} = require("../controllers/account-controller");
const { authMiddleware } = require("../middlewares/auth-middleware");
const router = express.Router();

router.get("/balance", authMiddleware, getBalance);
router.post("/transfer", authMiddleware, transferMoney);

module.exports = router;
