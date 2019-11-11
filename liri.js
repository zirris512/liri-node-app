require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var moment = require('moment');
var axios = require('axios');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);

const [,, command, ...search] = process.argv;

if (command == "concert-this" && search.length === 0) {
    search.push("korn");
}
if (command == "spotify-this-song" && search.length === 0) {
    search.push("The Sign Ace of Base");
}
if (command == "movie-this" && search.length === 0) {
    search.push("Mr. Nobody");
}

var joinedSearch = search.join(" ");

switch (command) {
    case "concert-this" :
        let URL = `https://rest.bandsintown.com/artists/${joinedSearch}/events?app_id=codingbootcamp`;
        axios.get(URL).then(function(response) {
            let bandEvent = response.data;
            for(let i = 0; i < 10; i++) {
                console.log(`
    Venue: ${bandEvent[i].venue ? bandEvent[i].venue.name : 'N/A'}
    Location: ${bandEvent[i].venue ? bandEvent[i].venue.city : 'N/A'}, ${bandEvent[i].venue ? bandEvent[i].venue.country : 'N/A'}
    Event Date: ${moment(bandEvent[i].datetime).format('MM/DD/YYYY')}
    `);
            }
        });
        break;
    case "spotify-this-song":
        spotify.search({type: 'track', query: joinedSearch, limit: 10}, function(err, data) {
            if (err) return console.log(`Error: ${err}`);
            let songInfo = data.tracks.items;
            
            for(let i = 0; i < 10; i++) {
                console.log(`
    Artist: ${songInfo[i].artists[0].name}
    Song: ${songInfo[i].name}
    Link: ${songInfo[i].href}
    Album: ${songInfo[i].album.name}
    `);
            }
        });
        break;
}