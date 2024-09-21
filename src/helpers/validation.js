const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new Error("Please provide all required fields");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error("First name should be between 3 and 50 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is weak, it should contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and a minimum length of 6"
    );
  } 
};

module.exports = { validateSignUpData };
