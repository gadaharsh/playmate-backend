import express from "express";
import {
  backoutFromEvent,
  joinEvent,
  rejectPlayer,
} from "../controllers/requests.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.post("/joinEvent", playerAuth, joinEvent);
router.post("/reject", playerAuth, rejectPlayer);
router.post("/backout", playerAuth, backoutFromEvent);

export default router;
