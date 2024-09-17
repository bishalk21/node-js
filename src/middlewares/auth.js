const authAdmin = (req, res, next) => {
  console.log("Admin auth is getting called");
  // const token = req.headers?.authorization;
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
  // const token = req.headers?.authorization;
  const dummyToken = "user";
  const isUserAuthenticated = dummyToken === "user";
  if (!isUserAuthenticated) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};

module.exports = { authAdmin, userAuth };
