import mongoose from "mongoose";

const playerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
  },
  countryCode: {
    type: String,
    required: true,
    default: "+91",
  },
  gender: {
    type: String,
    required: true,
    default: "Male",
  },
  email: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2018/04/18/18/56/user-3331257__340.png",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  rating: {
    type: Number,
    default: 2,
  },
});

const player = mongoose.model("player", playerSchema);

export default player;
