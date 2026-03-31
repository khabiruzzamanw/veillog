const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const user = require("../models/user.model.js");
const router = express.Router();
const path = require("path");
const authentify = require("../middlewares/authetication.middleware.js");

const frontendPath = path.join(__dirname, "../../frontend");

router.use(express.static(path.join(frontendPath, "assets")));

router.get("/users", authentify, function (req, res) {
  res.sendFile(path.join(frontendPath, "index.html"));
});

router.post("/signup", async function (req, res) {
  try {
    // log this if you need
    // console.log(req.body);
    const { email, username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUSer = new user({
      email,
      username,
      password: hashedPassword,
    });
    await newUSer.save();
    res.status(201).redirect("/signin");
  } catch (error) {
    res.status(500).send("Error saving user: " + error.message);
  }
});

router.get("/signup", function (req, res) {
  res.sendFile(path.join(frontendPath, "signup.html"));
});

router.post("/signin", async function (req, res) {
  // log this if you need
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    const foundUser = await user.findOne({ email });

    if (!foundUser) {
      return res.redirect("/signin?logerror=email or password is incorrect");
    }

    const corretPassword = await bcrypt.compare(password, foundUser.password);

    if (!corretPassword) {
      return res.redirect("/signin?logerror=email or password is incorrect");
    }

    const token = jsonwebtoken.sign(
      {
        id: foundUser._id,
        username: foundUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("token", token, { httpOnly: true });
    return res.redirect("/");
  } catch (error) {
    return res.status(500).send("Error logging in: " + error.message);
  }
});

router.get("/signin", function (req, res) {
  res.sendFile(path.join(frontendPath, "signin.html"));
});

module.exports = router;
