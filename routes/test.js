import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Server Is Running 🎆🎇🎆");
});

export default router;
