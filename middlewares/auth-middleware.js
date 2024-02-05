const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, secret);
    req.userId = decoded.userId;
    // console.log(decoded);
    next();
  } catch (error) {
    return res.status(403).json({
      err: error,
    });
  }
};

module.exports = { authMiddleware };
