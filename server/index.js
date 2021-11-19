const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
require("./db");

const app = express();
const port = process.env.PORT || 3003;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

const studentRouter = require("./routes/student-router");
const { handleError } = require("./middleware/handleError");

app.use(express.json());
app.use(cors());

app.use("/", studentRouter);

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, async () => {
  console.log(`Running on port ${port}`);
});
