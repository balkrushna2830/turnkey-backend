var express = require("express");
var router = express.Router();
const { check } = require("express-validator");
const { signup, signin, signout } = require("../Controller/Auth");

router.post(
  "/api/v1/signup",
  [
    check("contact", "Contact should be atmost 10 digits").isLength({ max: 10 }),
    check("password", "Password should be atleast 8 chars").isLength({ min: 8, }),
  ],
  signup
);
router.post(
  "/api/v1/signin",
  [
    check("contact", "Contact should be atmost 10 digits").isLength({ max: 10 }),
    check("password", "Password should be atleast 8 chars").isLength({ min: 8, }),
  ],
  signin
);
router.get("/signout", signout);

module.exports = router;
