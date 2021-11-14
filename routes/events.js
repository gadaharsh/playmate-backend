import express from "express";
import {
  createEvent,
  deleteAllEvents,
  getAllEventDetails,
  getBackedOutEvents,
  getEventsDummy,
  getEventsNearMe,
  getEventsOrganisedByMe,
  getJoinedPlayerEvents,
  getRejectedEvents,
} from "../controllers/events.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get("/dummy", getEventsDummy);
router.post("/nearMe", getEventsNearMe);
router.post("/create", playerAuth, createEvent);
router.get("/player", playerAuth, getEventsOrganisedByMe);
router.get("/player/joined", playerAuth, getJoinedPlayerEvents);
router.get("/player/cancelled", playerAuth, getBackedOutEvents);
router.get("/player/rejected", playerAuth, getRejectedEvents);
router.get("/:id", getAllEventDetails);
//router.delete("/delete", deleteAllEvents)

export default router;
