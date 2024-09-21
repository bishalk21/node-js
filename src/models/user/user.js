const mongoose = require("mongoose");

const testUserSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
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
  },
  about: {
    type: String,
    default: "I am a new user",
  },
  skills: {
    type: [String],
  },
});

const testUserModel = mongoose.model("Test-user", testUserSchema);
module.exports = testUserModel;
