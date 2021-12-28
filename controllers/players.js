import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import player from "../models/playerDetails.js";
import jwt from "jsonwebtoken";
import event from "../models/event.js";
import request from "../models/request.js";
import { testNotification } from "./notification.js";

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

export const getPlayerProfile = async (req, res) => {
  var playerId = req.params.id;
  try {
    var organisedFilter = {
      organiserId: playerId
    }
    var joinedRequestsFilter = {
      playerId,
      requestType: "Join Event"
    }
    var backedOutEventsFilter = {
      playerId,
      requestType: "Cancelled"
    }
    var playerDetails = await player.findOne({ _id: playerId })
    var allEvents = []
    var organisedEvents = await event.find(organisedFilter)
    console.log(organisedEvents)
    var joinedRequests = await request.find(joinedRequestsFilter);
    var backedOutRequests = await request.find(backedOutEventsFilter)
    console.log(joinedRequests)
    var joinedEvents = [];
    for (var i = 0; i < joinedRequests.length; i++) {
      var eventDet = await event.findOne({ _id: joinedRequests[i].eventId })
      console.log(eventDet)
      joinedEvents.push(eventDet)
    }
    console.log(joinedEvents)
    allEvents = [...organisedEvents, ...joinedEvents];
    var pieChart = {}
    for (var i = 0; i < allEvents.length; i++) {
      if (pieChart[allEvents[i].sport]) {
        pieChart[allEvents[i].sport] += 1;
      } else {
        pieChart[allEvents[i].sport] = 1;
      }
    }
    var labels = Object.keys(pieChart)
    var values = Object.values(pieChart)
    console.log(labels)
    var analysis = {
      organised: organisedEvents.length,
      joined: joinedEvents.length,
      backedOut: backedOutRequests.length
    }
    var data = {
      pieChart,
      labels,
      values,
      analysis,
      playerDetails
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
}

export const addWebFcmToken = async (req, res) => {
  var playerId = req.player._id
  try {
    await player.findOneAndUpdate({ _id: playerId }, {
      $addToSet: {
        webFcmToken: req.body.fcmToken
      }
    })
    var response = {
      message: "FcmToken Added"
    };
    //testNotification("Adding Token", "Adding Token Successfull", req.body.fcmToken)
    res.status(200).json(response);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const getPlayers = async (req, res) => {
  try {
    const players = await player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteAllPlayers = async (req, res) => {
  try {
    await player.deleteMany({});
    res.status(200).json({ message: "Players Deleted" })
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}