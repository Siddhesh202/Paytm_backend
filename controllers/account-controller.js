const { default: mongoose } = require("mongoose");
const { Account } = require("../models/account-model");

const getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({
            userId: req.userId,
        });

        res.status(200).json({
            balance: account?.balance,
        });
    } catch (error) {
        res.status(401).json({
            err: error,
        });
    }
};

const transferMoney = async (req, res) => {
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId,
    });

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance",
        });
    }

    const toAccount = await Account.findOne({
        userId: to,
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account",
        });
    }

    await Account.updateOne(
        {
            userId: req.userId,
        },
        {
            $inc: {
                balance: -amount,
            },
        }
    );

    await Account.updateOne(
        {
            userId: to,
        },
        {
            $inc: {
                balance: amount,
            },
        }
    );

    res.json({
        message: "Transfer successful",
    });
};

module.exports = { getBalance, transferMoney };