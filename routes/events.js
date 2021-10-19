import express from "express";
import { createEvent } from "../controllers/events.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.post("/create", playerAuth, createEvent);

export default router;
