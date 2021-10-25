import express from "express";
import { getPlayers, playerSignin, playerSignup } from "../controllers/players.js";

const router = express.Router();

router.get('/',getPlayers);
router.post('/signup',playerSignup)
router.post('/login',playerSignin)

export default router;