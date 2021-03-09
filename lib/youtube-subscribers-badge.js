const endpoint = require("@runkit/runkit/json-endpoint/1.0.0")
const request = require("request") // peer dependency
const requestPromise = require("request-promise")
const URL = require("url").URL
const URLSearchParams = require("url-search-params")
const fetch = require("node-fetch")

/**
 * @apiDescription YouTube subscribers badge API endpoint for shields.io
 * 
 * 2021 by Vivien Richter <vivien-richter@outlook.de>
 *
 * @api {get} / Request shield schema
 * @apiVersion 1.0.0
 * @apiName RequestShield
 * @apiGroup Shield
 *
 * @apiParam {String} id YouTube channel ID.
 * @apiParam {String} key YouTube API key.
 *
 * @apiSuccess {Number} schemaVersion Always the number 1.
 * @apiSuccess {String} labelColor The left color.
 * @apiSuccess {String} namedLogo One of the named logos supported by Shields or simple-icons.
 * @apiSuccess {String} label The left text.
 * @apiSuccess {String} color The right color.
 * @apiSuccess {String} message The amount of subscribers and 'SUBSCRIBERS'.
 *
 * @apiError {Number} schemaVersion Always the number 1.
 * @apiError {String} labelColor The left color.
 * @apiError {String} namedLogo One of the named logos supported by Shields or simple-icons.
 * @apiError {String} label The left text.
 * @apiError {String} color The right color.
 * @apiError {String} message Just 'CHANNEL'.
 */
endpoint(module.exports, async function(request) {
    try {
        // Gets required parameters
        var channelID = request.query.id
        var APIkey = request.query.key
        // Prepares YouTube API endpoint
        var url = new URL("https://www.googleapis.com/youtube/v3/channels");
        // Sets YouTube API parameters
        url.search = new URLSearchParams({part: "statistics", id: channelID, key: APIkey}).toString();
        // Fetching API request
        var response = await fetch(url)
        var json = await response.json()
        // Parsing request data
        var subscribers = json["items"][0]["statistics"]["subscriberCount"]
        // Creates status message
        if (typeof subscribers === "undefined") {
            var status = "CHANNEL"
        } else {
            var status = subscribers + " SUBSCRIBERS"
        }
    } catch(e) {
        var status = "CHANNEL"
    }

    return {
        schemaVersion: 1,
        labelColor: "red",
        namedLogo: "youtube",
        label: "YouTube",
        color: "lightgrey",
        message: status
    }
});
