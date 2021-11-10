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
    required: false,
  },
  rejection_reason: {
    type: String,
    required: false,
  },
  rejectedAt: {
    type: Date,
    required: false,
  },
  eventDay: {
    type: Date,
    required: false,
  },
});

const request = mongoose.model("request", requestSchema);

export default request;
