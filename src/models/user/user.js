const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const testUserSchema = new mongoose.Schema(
  {
    //   _id: mongoose.Schema.Types.ObjectId,
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is weak: " + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is invalid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH4dcYWVFHFsz8M3Rsjpy2Hg6gQAmgbCIwWA&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is invalid");
        }
      },
    },
    about: {
      type: String,
      default: "I am a new user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// instance method to create jwt token
testUserSchema.methods.createJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

// instance method to validate password
testUserSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  // validate password
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

const testUserModel = mongoose.model("Test-user", testUserSchema);
module.exports = testUserModel;
