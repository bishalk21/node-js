const bcrypt = require("bcrypt");

const saltRound = 10;
const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, saltRound);
};

const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
