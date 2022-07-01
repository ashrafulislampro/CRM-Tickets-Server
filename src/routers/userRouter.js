const express = require("express");
const router = express.Router();
const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" });
  next();
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

  if (!passFromDB)
    return res.json({ status: "error", message: "Invalid email or password!" });

  const result = await comparePassword(password, passFromDB);
  console.log(result);

  res.json({ status: "Success", message: "Login Successfully!" });
});

module.exports = router;
