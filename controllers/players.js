import player from "../models/playerDetails.js";

export const playerSignup = async (req, res) => {
  const body = req.body;
  console.log(body);
  const newPlayer = new player(body);
  try {
    await newPlayer.save();
    res.status(201).json(newPlayer);
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
