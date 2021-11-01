import mongoose from "mongoose";

const requestSchema = mongoose.Schema({
  playerId: {
    type: String,
    required: true,
  },
  eventId: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  cancellation_reason: {
    type: String,
    required: false,
  },
  cancelledAt: {
    type: Date,
    default: new Date(),
  },
  rejection_reason: {
    type: String,
    required: false,
  },
  rejectedAt: {
    type: Date,
    default: new Date(),
  },
});

const request = mongoose.model("request", requestSchema);

export default request;
