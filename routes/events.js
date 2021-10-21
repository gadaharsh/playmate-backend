import express from "express";
import { createEvent, getEventsDummy } from "../controllers/events.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get('/dummy',getEventsDummy)
router.post("/create", playerAuth, createEvent);

export default router;
