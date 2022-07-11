require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

// API security
// app.use(helmet());

// set body bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// handle cors error
app.use(cors());

// MongoDB Connection Setup
const database = (module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error", error.message);
    console.log("Database connection failed");
  }
});
database();

// const connectDatabase = () => {
//   mongoose
//     .connect("mongodb://localhost:27017/Ecommerse", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     })
//     .then((data) => {
//       console.log(`Mongodb connected with server: ${data.connection.host}`);
//     });
// };
// connectDatabase();

// logger
app.use(morgan("tiny"));

// Load routers
const userRouter = require("./src/routers/userRouter");
const ticketRouter = require("./src/routers/ticketRouter");

// Use Routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

// Error handler
const handleError = require("./src/utils/errorHandler");

app.use((req, res, next) => {
  const error = new Error("Resources not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  handleError(error, res);
});

app.use("*", (req, res) => {
  res.json({ message: "Resources not found" });
});

app.listen(port, () => {
  console.log("API is ready on the localhost:5000");
});
