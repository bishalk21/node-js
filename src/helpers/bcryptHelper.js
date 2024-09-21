const bcrypt = require("bcrypt");

const saltRound = 10;
const hashPassword = (plainPassword) => {
  return bcrypt.hash(plainPassword, saltRound);
};

module.exports = { hashPassword };
