import mongoose from "mongoose";
import event from "../models/event.js";
import player from "../models/playerDetails.js";
import request from "../models/request.js";
var ObjectId = mongoose.Types.ObjectId;
export const createEvent = async (req, res) => {
  const body = req.body;
  var id = req.player._id;
  body.organiserId = id;
  body.gender = req.player.gender;
  body.organiserContact = req.player.contact;
  console.log(body);
  const newEvent = new event(body);
  try {
    await newEvent.save();
    return res.status(201).json(body);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const getEventsNearMe = async (req, res) => {
  const options = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.body.longitude, req.body.latitude],
        },
        $maxDistance: 15000,
        $minDistance: 0,
      },
    },
    day: {
      $gte: new Date(Date.now()),
    },
    rem_players: {
      $gt: 0,
    },
  };
  if (req.body.sport) {
    options.sport = req.body.sport;
  }
  if (req.body.age) {
    options.age = { $gte: req.body.age - 5, $lte: req.body.age + 5 };
  }
  if (req.body.gender) {
    options.gender = req.body.gender;
  }
  console.log(options);
  if (req.body.day) {
    options.day = { $gte: req.body.day };
  }
  let { page, size } = req.body;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;
  event
    .find(options)
    .sort({ day: 1 })
    .limit(limit)
    .skip(skip)
    .then((data) => {
      var result = {
        page,
        size,
        data,
      };
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(409).json({ message: error.message });
    });
};

export const getEventsOrganisedByMe = async (req, res) => {
  var id = req.player._id;
  var options = {
    organiserId: id,
  };
  event
    .find(options)
    .sort({ day: -1 })
    .then((data) => {
      var result = {
        data,
      };
      res.status(201).json(result);
    })
    .catch((error) => {
      res.status(409).json({ message: error.message });
    });
};

export const getAllEventDetails = async (req, res) => {
  const id = req.params.id;
  var options = {
    _id: id,
  };
  if (!ObjectId.isValid(id)) {
    return res.status(409).json({ message: "No Valid Event For this Id" });
  }
  var filters = {
    eventId: id,
    requestType: "Join Event",
  };
  var eventDetails = await event.find(options);
  if (eventDetails.length < 1) {
    res.status(409).json({ message: "No Event WIth This Id" });
  }
  var joiningPlayers = await request.find(filters);
  var players = [];
  for (var i = 0; i < joiningPlayers.length; i++) {
    var playerData = await player.find({ _id: joiningPlayers[i].playerId });
    players.push(playerData[0]);
  }
  var result = {
    event: eventDetails[0],
    players: players,
  };
  console.log(result);
  res.status(201).json(result);
};

export const getEventsDummy = async (req, res) => {
  try {
    const events = await event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
