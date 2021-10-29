import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import testRoute from "./routes/test.js";
import playerRoute from "./routes/players.js";
import eventRoute from "./routes/events.js";
import playerAuth from "./util/playerAuth.js";
import { createEvent } from "./controllers/events.js";

const app = express();

/* app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); */
app.use(cors());
app.use(express.json());

app.use("/", testRoute);
app.use("/player", playerRoute);
app.use("/event", eventRoute);

const CONNECTION_URL =
  "mongodb+srv://rushil:Playmate10$@cluster0.lcuyx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  })
  .catch((error) => {
    console.log(error.message);
  });

//mongoose.set("useFindAndModify", false);
