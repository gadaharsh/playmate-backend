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
    .sort({ day: 1 })
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
    //requestType: "Join Event",
  };
  var eventDetails = await event.find(options);
  if (eventDetails.length < 1) {
    res.status(409).json({ message: "No Event WIth This Id" });
  }
  var joiningPlayers = await request.find(filters);
  var players = [];
  var rejectedPlayers = [];
  var backedOutPlayers = [];
  for (var i = 0; i < joiningPlayers.length; i++) {
    var playerData = await player.find({ _id: joiningPlayers[i].playerId });
    if (joiningPlayers[i].requestType === "Join Event") {
      players.push(playerData[0]);
    } else if (joiningPlayers[i].requestType === "Rejected") {
      rejectedPlayers.push(playerData[0])
    } else {
      backedOutPlayers.push(playerData[0])
    }
  }
  var result = {
    event: eventDetails[0],
    players: players,
    rejectedPlayers,
    backedOutPlayers
  };
  console.log(result);
  res.status(201).json(result);
};

export const getJoinedPlayerEvents = async (req, res) => {
  var playerId = req.player._id;
  var options = {
    playerId: playerId,
    requestType: "Join Event",
  };
  try {
    var events = await request.find(options);
    console.log(events);
    if (events.length < 1) {
      var result = {
        data: [],
      };
      return res.status(200).json(result);
    }
    var joinedEvents = [];
    for (var i = 0; i < events.length; i++) {
      var joined = await event.find({ _id: events[i].eventId });
      console.log(joined);
      joinedEvents.push(joined[0]);
    }
    var result = {
      data: joinedEvents,
    };
    return res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getBackedOutEvents = async (req, res) => {
  var playerId = req.player._id;
  var options = {
    playerId: playerId,
    requestType: "Cancelled",
  };
  try {
    var events = await request.find(options);
    console.log(events);
    if (events.length < 1) {
      var result = {
        data: [],
      };
      return res.status(200).json(result);
    }
    var backedoutEvents = [];
    for (var i = 0; i < events.length; i++) {
      var joined = await event.find({ _id: events[i].eventId });
      joined.push(events[i])
      console.log(joined)
      backedoutEvents.push(joined);
    }
    var result = {
      data: backedoutEvents,
    };
    return res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const getRejectedEvents = async (req, res) => {
  var playerId = req.player._id;
  var options = {
    playerId: playerId,
    requestType: "Rejected",
  };
  try {
    var events = await request.find(options);
    console.log(events);
    if (events.length < 1) {
      var result = {
        data: [],
      };
      return res.status(200).json(result);
    }
    var rejectedEvents = [];
    for (var i = 0; i < events.length; i++) {
      var joined = await event.find({ _id: events[i].eventId });
      joined.push(events[i])
      console.log(joined)
      rejectedEvents.push(joined);
    }
    var result = {
      data: rejectedEvents,
    };
    return res.status(200).json(result);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const getEventsDummy = async (req, res) => {
  try {
    const events = await event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
