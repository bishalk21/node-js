const express = require("express");
const router = express.Router();

router.get("/profile", authAdmin, async (req, res, next) => {
  try {
    // get the cookie
    // console.log(req.cookies);
    // check if the cookie is set
    // console.log(cookie);
    // const { token } = req.cookies;

    // if token, ==> valid user and can access the dashboard
    // if no token, ==> invalid user and not authorized
    // if (!token) {
    //   throw new Error("Unauthorized");
    // }

    // if token is present, then user is authorized

    // verify token
    // const decoded = jwt.verify(jwtToken, "mysecretkey");
    // const decoded = await verifyJwtToken(token);

    // console.log(decoded); // decoded token is the payload of the token or the id of the user and iat (issued at) in object format
    // const { id } = decoded;

    // res.send("Dashboard");
    // const user = await testUser.findById(id);
    // if (!user) {
    //   throw new Error("User not found");
    // }

    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(500).send("Error fetching dashboard: " + error.message);
  }
});

module.exports = router;
