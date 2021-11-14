import express from "express";
import { deleteAllPlayers, getPlayerProfile, getPlayers, playerSignin, playerSignup } from "../controllers/players.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get('/', getPlayers);
router.post('/signup', playerSignup)
router.post('/login', playerSignin)
router.get('/profile/:id', getPlayerProfile)
//router.delete('/delete', deleteAllPlayers)

export default router;