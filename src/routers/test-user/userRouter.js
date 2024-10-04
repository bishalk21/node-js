const express = require("express");
const { authAdmin } = require("../../middlewares/auth");
const { ConnectionReqModel } = require("../../models/connection/connectionReq");
const { testUserModel } = require("../../models/user/user");
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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUserId._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send({
      message: "Connections fetched successfully",
      connections: data,
    });
  } catch (error) {
    res.statusCode(400).send("Error: " + error.message);
  }
});

// feed api
router.get("/feed", authAdmin, async (req, res, next) => {
  try {
    // user [Bishal] should see all the other users [Anil, Suman, Akshay, Arjun, Keshav] except
    // - himself,
    // - and the users who are connected with him (if Bishal is connected with Anil, he should not see Anil in the feed, but [Suman, Akshay, Arjun, Keshav] should be visible)
    // - and Anil should not see Bishal in the feed
    // - and the users who have sent him connection request (if Suman has sent Bishal a connection request, Bishal should not see Suman in the feed, but [ Akshay, Arjun, Keshav] should be visible)
    // - and Bishal should not see the users to whom he has sent connection request
    // if Bishal has rejected the connection request from Anil, he should not see Anil in the feed
    // Anil should not see Bishal in the feed
    // user should see all the users who are not connected with him and have not sent him connection request [Akshay, Arjun, Keshav]
    const loggedInUserId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    limit = limit > 100 ? 100 : limit;

    // connection requests that are sent from and received by the logged in user
    const connectionRequests = await ConnectionReqModel.find({
      $or: [{ fromUserId: loggedInUserId }, { toUserId: loggedInUserId }],
    }).select("fromUserId toUserId");
    // .populate("fromUserId", "firstName")
    // .populate("toUserId", "firstName");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    console.log(hideUsersFromFeed);

    const users = await testUserModel
      .find({
        $and: [
          {
            _id: {
              $nin: Array.from(hideUsersFromFeed),
            },
          },
          {
            _id: {
              $ne: loggedInUserId,
            },
          },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.send({
      message: "Feed fetched successfully",
      users,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = router;
