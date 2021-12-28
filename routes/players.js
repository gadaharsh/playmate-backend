import express from "express";
import { testNotification } from "../controllers/notification.js";
import { addWebFcmToken, deleteAllPlayers, getPlayerProfile, getPlayers, playerSignin, playerSignup } from "../controllers/players.js";
import playerAuth from "../util/playerAuth.js";

const router = express.Router();

router.get('/', getPlayers);
router.post('/signup', playerSignup)
router.post('/login', playerSignin)
router.post('/webFcmToken', playerAuth, addWebFcmToken)
router.get('/profile/:id', getPlayerProfile)
router.post('/notify', testNotification)
//router.delete('/delete', deleteAllPlayers)

export default router;