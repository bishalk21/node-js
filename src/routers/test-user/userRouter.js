const express = require("express");
const { authAdmin } = require("../../middlewares/auth");
const { ConnectionReqModel } = require("../../models/connection/connectionReq");
const router = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl about skills";

// get all the pending connection requests for the logged in user
router.get("/requests/received", authAdmin, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const connectionRequests = await ConnectionReqModel.find({
      toUserId: loggedInUserId,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId, ['firstName', 'lastName']");
    res.send({
      message: "Connection requests fetched successfully",
      connectionRequests,
    });
  } catch (error) {
    res.statusCode(400).send("Error: " + error.message);
  }
});

// get all the connections that are accepted
router.get("/connections", authAdmin, async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;
    const connections = await ConnectionReqModel.find({
      $or: [
        { fromUserId: loggedInUserId, status: "accepted" },
        { toUserId: loggedInUserId, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connections.map((row) => row.fromUserId);

    res.send({
      message: "Connections fetched successfully",
      data,
    });
  } catch (error) {
    res.statusCode(400).send("Error: " + error.message);
  }
});

module.exports = router;
