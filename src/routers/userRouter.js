const express = require("express");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" });
  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  // this data coming form database
  const _id = req.userId;

  const userProf = await getUserById(_id);

  res.json({ user: userProf });
});

// Create new user router
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    // hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };
    const result = await insertUser(newUserObj);
    // console.log(result);
    res.json({ message: "New User Created", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// User sign in Router
router.post("/login", async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    res.json({ status: "error", message: "Invalid form submition!" });
  }

  // get user with email from db
  const user = await getUserByEmail(email);
  // console.log(user);
  // hash our password and compaire with the db one
  const passFromDB = user && user._id ? user.password : null;

  if (!passFromDB) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }

  const result = await comparePassword(password, passFromDB);

  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password!" });
  }

  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);
  const accessJWT = await createAccessJWT(user.email, `${user._id}`);

  res.json({
    status: "Success",
    message: "Login Successfully!",
    accessJWT,
    refreshJWT,
  });
});

module.exports = router;
