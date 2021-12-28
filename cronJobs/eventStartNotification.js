import { createRequire } from "module";
import moment from "moment";
import { sendNotification } from "../controllers/notification.js";
import event from "../models/event.js";
import player from "../models/playerDetails.js";
const require = createRequire(import.meta.url);
const cron = require('node-cron')

export const eventStartNotify = cron.schedule("0 0 */1 * * *", async () => {
    try {
        console.log("Started");
        var tod = new Date();
        var now = new Date();
        var tomm = tod.setDate(tod.getDate() + 2);
        //console.log(tomm);
        const options = {
            day: {
                $gte: new Date(Date.now()),
                $lte: new Date(tomm)
            },
            eventStatus: "created"
        }
        var events = await event.find(options)
        var n = events.length;
        //console.log(events)
        for (var i = 0; i < n; i++) {
            var ed = new Date(events[i].day)
            ed.setHours(events[i].timings.getHours())
            ed.setMinutes(events[i].timings.getMinutes())
            var hours = Math.abs(ed - now) / 36e5
            var diff = parseInt(hours)
            if (diff == 12 || diff == 6 || diff == 1 || diff == 24) {
                var playerIds = [...events[i].joinedPlayers]
                playerIds.push(events[i].organiserId)
                console.log(playerIds)
                var allPlayers = []
                var allTokens = []
                for (var j = 0; j < playerIds.length; j++) {
                    var id = playerIds[i]
                    var playerDet = await player.find({ _id: id })
                    if (playerDet.length > 0 && playerDet[0].webFcmToken && playerDet[0].webFcmToken.length > 0) {
                        allTokens = [...allTokens, ...playerDet[0].webFcmToken]
                    }
                }
                if (allTokens.length > 0 && diff < 24) {
                    //var uniq = [...new Set(allTokens)];
                    //uniq.filter(String)
                    //console.log(uniq)
                    var title = `${events[i].sport} event in ${diff} hours`
                    var message = `${events[i].sport} event is scheduled today, starting at ${moment(events[i].timings).format("h:mm a")} ${moment(events[i].day).format('dddd')}`
                    sendNotification(title, message, allTokens)
                }
                if (allTokens.length > 0 && diff == 24) {
                    //var uniq = [...new Set(allTokens)];
                    //uniq.filter(String)
                    //console.log(uniq)
                    var title = `${events[i].sport} event today`
                    var message = `${events[i].sport} event is scheduled today, starting at ${moment(events[i].timings).format("h:mm a")} ${moment(events[i].day).format('dddd')}`
                    sendNotification(title, message, allTokens)
                }
            }
        }
    } catch (e) {
        console.log(e);
    }
})