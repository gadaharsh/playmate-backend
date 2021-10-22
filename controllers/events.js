import event from "../models/event.js";

export const createEvent = async (req, res) => {
  const body = req.body;
  var id = req.player._id;
  body.organiserId = id;
  body.gender = req.player.gender;
  console.log(body);
  const newEvent = new event(body);
  try {
    await newEvent.save();
    return res.status(201).json(body);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const getEventsNearMe = async (req, res) => {
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
    day: {
      $gt: new Date(Date.now()),
    },
  };
  if (req.body.sport) {
    options.sport = req.body.sport;
  }
  if (req.body.age) {
    options.age = { $gte: req.body.age - 5, $lte: req.body.age + 5 };
  }
  if (req.body.gender) {
    options.gender = req.body.gender;
  }
  console.log(new Date(Date.now()));
  if (req.body.day) {
    options.day = { $gte: req.body.day };
  }
  let { page, size } = req.body;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 10;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;
  event
    .find(options)
    .limit(limit)
    .skip(skip)
    .then((data) => {
      var result = {
        page,
        size,
        data,
      };
      res.status(201).json(result);
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
