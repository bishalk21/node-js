const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

connectionReqSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

connectionReqSchema.pre("save", async function (next) {
  const connectionReq = this;
  if (connectionReq.fromUserId.equals(connectionReq.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
  next();
});

const ConnectionReqModel = new mongoose.model(
  "ConnectionRequest",
  connectionReqSchema
);

module.exports = { ConnectionReqModel };
