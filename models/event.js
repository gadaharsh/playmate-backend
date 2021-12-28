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
  organiserId: {
    type: String,
    required: true,
  },
  organiserContact: {
    type: String,
    required: false,
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
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  gender: {
    type: String,
    default: "Male",
  },
  joinedPlayers: {
    type: [String],
    default: [],
  },
  eventStatus: {
    type: String,
    default: "created",
  },
  cancelledAt: {
    type: Date,
    required: false,
  },
  cancellationReason: {
    type: String,
    required: false,
  },
  rejectedPlayersId: {
    type: [String],
    default: [],
  },
});

const event = mongoose.model("event", eventScehma);

export default event;
