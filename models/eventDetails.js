import mongoose from "mongoose";

const eventSchema = mongoose.Schema({
    eventName: {
        type: String,
        required: true,
    },
    eventCreator: {
        type: String,
        required: true
    },
    location: {
        // venue
        //object geojson
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    totalPlayers: {
        type: integer,
        required: true
    },
    slotsLeft: {
        type: integer,
        required: true
    },
    price: {
        type: integer,
        required: true,
    },
    eventTime: {
        //Organizer specified Date
        type: Date,
        required: true,
    },
    sport: {
        type: String,
        required: true,
    },
    ageGroup: {
        type: String,
        required: false,
    }
});

const event = mongoose.model("event", playerSchema);
export default event;
