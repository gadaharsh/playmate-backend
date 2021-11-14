import express from "express";
import {
  backoutFromEvent,
  deleteAllRequests,
  joinEvent,
  rejectPlayer,
} from "../controllers/requests.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.post("/joinEvent", playerAuth, joinEvent);
router.post("/reject", playerAuth, rejectPlayer);
router.post("/backout", playerAuth, backoutFromEvent);
//router.delete("/delete", deleteAllRequests);

export default router;
