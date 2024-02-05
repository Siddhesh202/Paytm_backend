const cors = require("cors");
const express = require("express");
const connect = require("./config/db");
const bodyParser = require("body-parser");
const rootRouter = require("./routes/index");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", rootRouter);

app.listen(3000, async () => {
  console.log("Server is Running on PORT 3000");
  await connect();
  console.log("MongoDB connected");
  // console.log(process.env.JWT_SECRET);
});
