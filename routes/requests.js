import express from "express";
import { joinEvent } from "../controllers/requests.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.post("/joinEvent", playerAuth, joinEvent);

export default router;
