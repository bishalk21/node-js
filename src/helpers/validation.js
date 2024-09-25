const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, email, password } = req.body;
  if (!firstName || !email || !password) {
    throw new Error("Please provide all required fields");
  } else if (firstName.length < 2 || firstName.length > 50) {
    throw new Error("First name should be between 2 and 50 characters");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is weak, it should contain at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and a minimum length of 6"
    );
  }
};

const validateProfileEditData = (req) => {
  const UPDATE_ALLOWED_FIELDS = [
    "firstName",
    "lastName",
    "about",
    "age",
    "photoUrl",
    "skills",
  ];

  const fields = Object.keys(req.body);
  const isUpdateAllowed = fields.every((field) => {
    return UPDATE_ALLOWED_FIELDS.includes(field);
  });

  if (!isUpdateAllowed) {
    throw new Error("Invalid fields for update");
  }

  return true;
};

module.exports = { validateSignUpData, validateProfileEditData };
