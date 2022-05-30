const userSchema = require("../Model/User");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
exports.signup = (req, res) => {
  var user = new userSchema(req.body);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array()[0]);
    res.send({ error: error.array()[0] });
    return;
  }
  user.save((err, user) => {
    if (err) {
      res.send({ error: err })
    } else {
      console.log("User Registred");
      res.status(200).send({ success: "User Registred", id: user._id });
    }
  });
};
exports.signin = (req, res) => {
  console.log(req.body);
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.send({ error: error.array()[0] });
    return;
  }
  const { contact, password } = req.body;
  userSchema.findOne({ contact }, (err, user) => {
    if (err || !user) {
      res.status(400).json({ error: "user not found" });
      return;
    }
    if (!user.authenticate(password)) {
      res.status(404).json({ error: "Wrong Password" });
      return;
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res
      .status(200)
      .json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          contact: user.contact,
        },
      });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signed Out Successfully",
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET_KEY,
  userProperty: "auth",
});

//Custome Middleware
exports.isAuthenticated = (req, res, next) => {
  if (req.user && req.auth && req.user._id == req.auth.id) {
    next();
  } else {
    res.status(403).json({ error: "ACCESS DENIED Auth" });
  }
};
