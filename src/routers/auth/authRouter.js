const express = require("express");
const { validateSignUpData } = require("../../helpers/validation");
const { hashPassword } = require("../../helpers/bcryptHelper");
const { testUserModel } = require("../../models/user/user");
const validator = require("validator");
const router = express.Router();

router.post("/sign-up", async (req, res, next) => {
  try {
    // console.log(req); // express responds with object containing request details

    // encrypting password
    //  validation of data
    validateSignUpData(req);

    // encrypting password
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);

    // console.log(req.body);
    // if the body is empty, it will return undefined
    // if the body is in JSON format, it will return the undefined as server cannot read JSON data
    // to read JSON data, we need to use middleware to parse the JSON data (body-parser or express.json())

    // saving user
    const newUser = {
      ...req.body,
      password: hashedPassword,
    };

    const user = new testUserModel(newUser);
    // const user = new testUser(req.body);
    await user.save();
    res.send("User Created Successfully");
  } catch (error) {
    res.status(500).send("Error saving user:" + error.message);
  }
});

// login api
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validate email
    if (!email) {
      throw new Error("Email is required");
    } else if (!validator.isEmail(email)) {
      throw new Error("Email is invalid");
    }

    // find user by email
    const user = await testUserModel.findOne({
      email,
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // compare password
    const isPasswordMatched = await user.validatePassword(password);
    if (!isPasswordMatched) {
      throw new Error("Invalid credentials");
    } else {
      // generate token (JWT)
      // const token = await jwt.sign({ id: user._id }, "mysecretkey");
      const token = await user.createJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.send("User logged in successfully");
    }
  } catch (error) {
    res.status(500).send("Error logging in user: " + error.message);
  }
});

module.exports = router;
