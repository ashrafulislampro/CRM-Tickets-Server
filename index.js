require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

// API security
app.use(helmet());

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
  };
  try {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gdwvp.mongodb.net/?retryWrites=true&w=majority`,
      connectionParams
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
    console.log("Database connection failed");
  }
});
database();

// main().catch((err) => console.log(err));

// async function main() {
//   await mongoose.connect(process.env.MONGO_URL);
//   console.log();
// }
// await mongoose.connect('mongodb://localhost/my_database');
// mongoose.connect(process.env.MONGO_URL);

// mongoose.connect("mongodb://localhost:27017/test");

// if (process.env.NODE_ENV !== "production") {
//   const mDB = mongoose.connection;
//   mDB.on("open", () => {
//     console.log("MongoDB is connected");
//   });

// } else {
//   mDB.on("error", (error) => {
//     console.log("errorasasas", error);
//   });
// }

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
