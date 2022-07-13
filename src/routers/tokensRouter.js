const express = require("express");
const router = express.Router();
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../model/user/User.model");

router.all("/", async (req, res) => {
  const { authorization } = req.headers;

  // TODO
  // 1. make sure the token is valid
  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    // 2. check if the jwt is exist in database
    const userProf = await getUserByEmail(decoded.email);

    // res.json({ message: userProf });
    if (userProf._id) {
      let tokenExp = userProf.refreshJWT.addedAt;
      const dbRefreshToken = userProf.refreshJWT.token;

      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      const today = new Date();

      if (dbRefreshToken !== authorization && tokenExp < today) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessJWT = await createAccessJWT(
        decoded.email,
        userProf._id.toString()
      );
      return res.json({ status: "success", accessJWT });
    }
  }
  // 3. check if it is not expired
  return res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
