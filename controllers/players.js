import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import player from "../models/playerDetails.js";
import jwt from "jsonwebtoken";

export const playerSignup = async (req, res) => {
  const body = req.body;
  console.log(body);
  const newPlayer = new player(body);
  try {
    await newPlayer.save();
    const token = jwt.sign(newPlayer.toJSON(), process.env.ACCESS_TOKEN_SECRET);
    console.log("newPlayer");
    console.log(token);
    var playerData = {
      token,
    };
    console.log(playerData);
    res.status(201).json(playerData);
  } catch (error) {
    var message = error.message;
    try {
      const playerData = await player.find({ contact: body.contact });
      if (playerData.length > 0) {
        const token = jwt.sign(
          playerData[0].toJSON(),
          process.env.ACCESS_TOKEN_SECRET
        );
        console.log("newPlayer");
        console.log(token);
        var playerDetails = {
          token,
        };
        console.log(playerDetails);
        res.status(201).json(playerDetails);
      }
    } catch (error) {
      res.status(409).json({ message: message });
    }
    res.status(409).json({ message: error.message });
  }
};

export const playerSignin = async (req, res) => {
  const body = req.body;
  console.log(req.body);
  const contact = body.contact;
  console.log(contact);
  try {
    const playerData = await player.find({ contact: contact });
    console.log(playerData);
    console.log(playerData[0]);
    if (playerData.length > 0) {
      const token = jwt.sign(
        playerData[0].toJSON(),
        process.env.ACCESS_TOKEN_SECRET
      );
      console.log("newPlayer");
      console.log(token);
      var playerDetails = {
        token,
      };
      console.log(playerDetails);
      res.status(201).json(playerDetails);
    } else {
      res
        .status(409)
        .json({ error: "Account Does Not Exists ! Signup First " });
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getPlayers = async (req, res) => {
  try {
    const players = await player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
