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
      "https://www.cornwallbusinessawards.co.uk/wp-content/uploads/2017/11/dummy450x450.jpg",
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
    default: 0,
  },
});

const player = mongoose.model("player", playerSchema);

export default player;
