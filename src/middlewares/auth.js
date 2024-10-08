const { verifyJwtToken } = require("../helpers/jwtHelper");
const { testUserModel } = require("../models/user/user");

// auth middleware for authenticating and authorizing access to the routes
const authAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      // throw new Error("Unauthorized");
      return res.status(401).send("Please login to access");
    }

    const decoded = await verifyJwtToken(token);
    const { id } = decoded;
    const user = await testUserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
};

// dummy auth middleware
const authAdmins = (req, res, next) => {
  console.log("Admin auth is getting called");
  const dummyToken = "admin";
  const isAdminAuthenticated = dummyToken === "admin";
  if (!isAdminAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth is getting called");
  const dummyToken = "user";
  const isUserAuthenticated = dummyToken === "user";
  if (!isUserAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = { authAdmin, authAdmins, userAuth };
