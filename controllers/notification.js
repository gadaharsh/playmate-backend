
import { createRequire } from "module";
const require = createRequire(import.meta.url);
var FCM = require('fcm-node')
var serverKey = require('../playmate-privatekey.json')
var fcm = new FCM(serverKey);

export const sendNotification = async (title, body, tokens) => {
    var uniqueArray = await [... new Set(tokens)]
    var message = {
        registration_ids: uniqueArray,
        notification: {
            title: title,
            body: body
        },
    };
    console.log(message, "sendNotification")
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);
            if (response.results) {
                //console.log(response.results[0])
            }
        }
    });
}


export const testNotification = (req, res) => {
    console.log("notify")
    var title = req.body.title
    var body = req.body.body
    var rtoken = req.body.fcmToken
    var message = {
        registration_ids: [rtoken],
        notification: {
            title: title,
            body: body
        },
    };
    console.log(message)
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!", err);
        } else {
            console.log("Successfully sent with response: ", response);
            if (response.results) {
                console.log(response.results[0])
            }
        }
    });
}