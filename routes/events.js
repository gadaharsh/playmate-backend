import express from "express";
import {
  cancelEvent,
  createEvent,
  deleteAllEvents,
  getAllBackedOutEvents,
  getAllEventDetails,
  getAllEventsOrganisedByMe,
  getAllJoinedPlayerEvents,
  getAllRejectedEvents,
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
router.post("/cancel", playerAuth, cancelEvent);
router.get("/player", playerAuth, getEventsOrganisedByMe);
router.get("/player/all", playerAuth, getAllEventsOrganisedByMe);
router.get("/player/joined", playerAuth, getJoinedPlayerEvents);
router.get("/player/joined/all", playerAuth, getAllJoinedPlayerEvents);
router.get("/player/cancelled", playerAuth, getBackedOutEvents);
router.get("/player/cancelled/all", playerAuth, getAllBackedOutEvents);
router.get("/player/rejected", playerAuth, getRejectedEvents);
router.get("/player/rejected/all", playerAuth, getAllRejectedEvents);
router.get("/:id", getAllEventDetails);
//router.delete("/delete", deleteAllEvents)

export default router;
