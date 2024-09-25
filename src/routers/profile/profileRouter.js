const express = require("express");
const { authAdmin } = require("../../middlewares/auth");
const { validateProfileEditData } = require("../../helpers/validation");
const router = express.Router();

router.get("/view", authAdmin, async (req, res, next) => {
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

router.patch("/edit", authAdmin, async (req, res, next) => {
  try {
    // validate data
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid fields for update");
    }

    const loggedInUser = req.user;
    // console.log("before update", loggedInUser);

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    // console.log("after update", loggedInUser);
    // save the updated user
    const updatedUser = await loggedInUser.save();

    res.send({
      message: `Hey ${loggedInUser.firstName}, your profile is updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).send("Error updating user: " + error.message);
  }
});

// forgot password
router.post("/forgot-password", async (req, res, next) => {});

module.exports = router;
