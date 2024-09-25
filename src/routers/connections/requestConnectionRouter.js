const express = require("express");
const { authAdmin } = require("../../middlewares/auth");
const { ConnectionReqModel } = require("../../models/connection/connectionReq");
const { Connection } = require("mongoose");
const { testUserModel } = require("../../models/user/user");
const router = express.Router();

router.post("/send/:status/:toUserId", authAdmin, async (req, res, next) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const ALLOWED_STATUS = ["ignored", "interested"];

    if (!ALLOWED_STATUS.includes(status)) {
      return res.status(400).send({
        message: `Invalid status: ${status}. Allowed status: ${ALLOWED_STATUS.join(
          ", "
        )}`,
      });
    }

    // if user is trying to send request to himself
    // OR can use pre-save hook to check this
    // if (fromUserId === toUserId) {
    //   return res.status(400).send({
    //     message: `You cannot send connection request to yourself`,
    //   });
    // }

    // if random user id is passed (toUserId), using logical db query to check
    const toUser = await testUserModel.findById(toUserId);
    if (!toUser) {
      return res.status(400).send({
        message: `User not found`,
      });
    }

    // if there is an existing request, using logical db query to check
    const existingRequest = await ConnectionReqModel.findOne({
      $or: [
        {
          fromUserId,
          toUserId,
        },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingRequest) {
      return res.status(400).send({
        message: `Connection request already exists`,
        existingRequest,
      });
    }

    const connectionRequest = new ConnectionReqModel({
      fromUserId,
      toUserId,
      status,
    });

    const result = await connectionRequest.save();

    res.send({
      message: `${req.user.firstName} ${
        status === "ignored" ? "ignored" : "is interested in"
      } ${toUser.firstName}`,
      result,
    });
  } catch (error) {
    res.status(500).send("Error sending request: " + error.message);
  }
});

module.exports = router;
