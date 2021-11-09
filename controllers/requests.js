import event from "../models/event.js";
import request from "../models/request.js";

export const joinEvent = async (req, res) => {
  const body = req.body;
  var playerId = req.player._id;
  body.playerId = playerId;
  body.requestType = "Join Event";
  var eventId = req.body.eventId;
  try {
    const ifJoined = await request.find({
      eventId: eventId,
      playerId: playerId,
    });
    if (ifJoined.length > 0) {
      res.status(400).json({ error: "You are already part of the event" });
    } else {
      const joinRequest = new request(body);
      await joinRequest.save();
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
  //Update Event 1.Rem Players 2.Rejected players
  //Update requests 1.type rejected At rejected reason
  console.log(req.body);
  try {
    await event.findOneAndUpdate(
      { _id: eventId },
      {
        $push: {
          rejectedPlayersId: playerId,
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
