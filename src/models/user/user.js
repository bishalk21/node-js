const mongoose = require("mongoose");

const testUserSchema = new mongoose.Schema({
  //   _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
});

const testUserModel = mongoose.model("Test-user", testUserSchema);
module.exports = testUserModel;
