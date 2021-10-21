import mongoose from "mongoose";

const eventScehma = mongoose.Schema({
  total_players: {
    type: Number,
    required: true,
  },
  rem_players: {
    type: Number,
    required: true,
  },
  price_per_person: {
    type: Number,
    required: true,
  },
  timings: {
    type: Date,
    required: true,
  },
  day: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  organiserId: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  additionalAddressInfo: {
    type: String,
    required: false,
  },
  currency: {
    type: String,
    default: "INR",
  },
});

const event = mongoose.model("event", eventScehma);

export default event;
