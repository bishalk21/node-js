const jwt = require("jsonwebtoken");

const createSignAccessJWT = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

const verifyJwtToken = async (token) => {
  const accessJWT = await jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  return accessJWT;
};

module.exports = { createSignAccessJWT, verifyJwtToken };
