import express from "express";
import {
  createEvent,
  getEventsDummy,
  getEventsNearMe,
} from "../controllers/events.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get("/dummy", getEventsDummy);
router.post("/nearMe", getEventsNearMe);
router.post("/create", playerAuth, createEvent);

export default router;
