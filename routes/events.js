import express from "express";
import {
  createEvent,
  getAllEventDetails,
  getEventsDummy,
  getEventsNearMe,
  getEventsOrganisedByMe,
  getJoinedPlayerEvents,
} from "../controllers/events.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get("/dummy", getEventsDummy);
router.post("/nearMe", getEventsNearMe);
router.post("/create", playerAuth, createEvent);
router.get("/player", playerAuth, getEventsOrganisedByMe);
router.get("/player/joined", playerAuth, getJoinedPlayerEvents);
router.get("/:id", getAllEventDetails);

export default router;
