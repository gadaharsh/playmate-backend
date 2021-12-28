import moment from "moment";
import event from "../models/event.js";
import player from "../models/playerDetails.js";
import request from "../models/request.js";
import { sendNotification } from "./notification.js";

export const joinEvent = async (req, res) => {
  const body = req.body;
  var playerId = req.player._id;
  body.playerId = playerId;
  body.requestType = "Join Event";
  body.eventDay = req.body.eventDay;
  var eventId = req.body.eventId;
  try {
    const ifJoined = await request.find({
      eventId: eventId,
      playerId: playerId,
      //requestType: "Join Event",
    });
    if (ifJoined.length > 0 && ifJoined.requestType === "Join Event") {
      res.status(400).json({ error: "You are already part of the event" });
    } else if (ifJoined.length > 0 && (ifJoined.requestType !== "Join Event")) {
      var eventDetails = await event.find({ _id: eventId })
      var playerDetails = await player.find({ _id: playerId })
      //console.log(eventDetails, playerDetails)
      await request.findOneAndUpdate(
        {
          eventId: eventId,
          playerId: playerId,
        },
        {
          $set: {
            requestType: "Join Event",
            createdAt: new Date()
          },
        }
      );
      await event.findOneAndUpdate(
        { _id: eventId },
        {
          $push: {
            joinedPlayers: playerId,
          },
          $inc: {
            rem_players: -1,
          },
        }
      );
      var organiserDetails = await player.find({ _id: eventDetails[0].organiserId })
      //console.log(organiserDetails[0].webFcmToken.length)
      if (organiserDetails[0].webFcmToken.length > 0) {
        var notTitle = `${playerDetails[0].name} just joined your ${eventDetails[0].sport} event`
        var notBody = ``
        if (eventDetails[0].rem_players - 1 == 0) {
          notBody = `All Seats filled for your ${eventDetails[0].sport} event`
        } else {
          notBody = `${eventDetails[0].rem_players - 1} players left fot your ${eventDetails[0].sport} event`
        }
        sendNotification(notTitle, notBody, organiserDetails[0].webFcmToken)
      }
      var response = {
        message: "Event Joined",
        eventId,
      };
      res.status(200).json(response);
    } else {
      const joinRequest = new request(body);
      await joinRequest.save();
      var eventDetails = await event.find({ _id: eventId })
      var playerDetails = await player.find({ _id: playerId })
      await event.findOneAndUpdate(
        { _id: eventId },
        {
          $push: {
            joinedPlayers: playerId,
          },
          $inc: {
            rem_players: -1,
          },
        }
      );
      var organiserDetails = await player.find({ _id: eventDetails[0].organiserId })
      if (organiserDetails[0].webFcmToken.length > 0) {
        var notTitle = `${playerDetails[0].name} just joined your ${eventDetails[0].sport} event`
        var notBody = ``
        if (eventDetails[0].rem_players - 1 == 0) {
          notBody = `All Seats filled for your ${eventDetails[0].sport} event`
        } else {
          notBody = `${eventDetails[0].rem_players - 1} players left fot your ${eventDetails[0].sport} event`
        }
        sendNotification(notTitle, notBody, organiserDetails[0].webFcmToken)
      }
      var response = {
        message: "Event Joined",
        eventId,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const rejectPlayer = async (req, res) => {
  var eventId = req.body.eventId;
  var playerId = req.body.playerId;
  var rejectReason = req.body.rejectReason;
  try {
    var eventDetails = await event.find({ _id: eventId })
    var playerDetails = await player.find({ _id: playerId })
    //console.log(playerDetails,eventDetails)
    await event.findOneAndUpdate(
      { _id: eventId },
      {
        $push: {
          rejectedPlayersId: playerId,
        },
        $pull: {
          joinedPlayers: playerId,
        },
        $inc: {
          rem_players: 1,
        },
      }
    );
    await request.findOneAndUpdate(
      {
        eventId: eventId,
        playerId: playerId,
      },
      {
        $set: {
          rejection_reason: rejectReason,
          requestType: "Rejected",
          rejectedAt: new Date(),
        },
      }
    );
    if (playerDetails[0].webFcmToken.length > 0) {
      var notTitle = `You have been removed from ${eventDetails[0].sport} event`
      var notBody = `This ${eventDetails[0].sport} event was scheduled on ${moment(eventDetails[0].day).format('dddd')}`
      sendNotification(notTitle, notBody, playerDetails[0].webFcmToken)
    }
    var response = {
      message: "Player Rejected",
      eventId,
      playerId,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const backoutFromEvent = async (req, res) => {
  var eventId = req.body.eventId;
  var playerId = req.body.playerId;
  var backoutReason = req.body.backoutReason;
  //console.log(req.body);
  try {
    var eventDetails = await event.find({ _id: eventId })
    var playerDetails = await player.find({ _id: playerId })
    await event.findOneAndUpdate(
      { _id: eventId },
      {
        $inc: {
          rem_players: 1,
        },
        $pull: {
          joinedPlayers: playerId,
        },
      }
    );
    await request.findOneAndUpdate(
      {
        eventId: eventId,
        playerId: playerId,
      },
      {
        $set: {
          cancellation_reason: backoutReason,
          requestType: "Cancelled",
          cancelledAt: new Date(),
        },
      }
    );
    var organiserDetails = await player.find({ _id: eventDetails[0].organiserId })
    if (organiserDetails[0].webFcmToken.length > 0) {
      var notTitle = `${playerDetails[0].name} just backed out from your ${eventDetails[0].sport} event`
      var notBody = `${eventDetails[0].rem_players + 1} players left fot your ${eventDetails[0].sport} event`
      sendNotification(notTitle, notBody, organiserDetails[0].webFcmToken)
    }
    var response = {
      message: "Player Cancelled",
      eventId,
      playerId,
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const deleteAllRequests = async (req, res) => {
  try {
    await request.deleteMany({});
    res.status(200).json({ message: "Requests Deleted" })
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
