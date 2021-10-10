import express from "express";
import { getPlayers, playerSignup } from "../controllers/players.js";

const router = express.Router();

router.get('/',getPlayers);
router.post('/signup',playerSignup)

export default router;