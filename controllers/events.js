import event from "../models/event.js";

export const createEvent = async (req, res) => {
  const body = req.body;
  var id = req.player._id;
  body.organiserId = id;
  console.log(body);
  const newEvent = new event(body);
  try {
    await newEvent.save();
    return res.status(201).json(body);
  } catch (err) {
    res.status(409).json({ message: error.message });
  }
};

export const getEventsNearMe = (req, res) => {
  const options = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [req.body.longitude, req.body.latitude],
        },
        $maxDistance: 15000,
        $minDistance: 0,
      },
    },
  };
  event
    .find(options)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((error) => {
      res.status(409).json({ message: error.message });
    });
};

export const getEventsDummy = async (req, res) => {
  try {
    const events = await event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
