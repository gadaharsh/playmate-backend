import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "production" });
import jwt from "jsonwebtoken";

const playerAuth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error(err);
    return res.status(403).json({ error: "Unauthorized" });
  }
  jwt.verify(idToken, process.env.ACCESS_TOKEN_SECRET, (err, player) => {
    if (err) return res.json({ error: "Error while Verifying Token" });
    req.player = player;
    console.log(player);
    next();
  });
};

export default playerAuth;