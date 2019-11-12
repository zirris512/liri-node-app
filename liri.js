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
if (command == "do-what-it-says") {
        fs.readFile('random.txt','utf8', function(err,data) {
            if (err) return console.log(`Error: ${err}`);
            var dataArr = data.split(',');
            search.push(dataArr[1]);
            spotifySong(search);
        })
}

function spotifySong (search) {
    spotify.search({type: 'track', query: search, limit: 10}, function(err, data) {
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
}

const joinedSearch = search.join(" ");

switch (command) {
    case "concert-this" :
        let concertURL = `https://rest.bandsintown.com/artists/${joinedSearch}/events?app_id=codingbootcamp`;
        axios.get(concertURL).then(function(response) {
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
        spotifySong(joinedSearch);
        break;
    case "movie-this":
        let movieURL = `https://www.omdbapi.com/?t=${joinedSearch}&apikey=trilogy`;
        axios.get(movieURL).then(function(response) {
            let movieInfo = response.data;
            console.log(`
    Title: ${movieInfo.Title}
    Year: ${movieInfo.Year}
    IMDB Rating: ${movieInfo.imdbRating}
    Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}
    Produced: ${movieInfo.Country}
    Language: ${movieInfo.Language}
    Plot: ${movieInfo.Plot}
    Actors: ${movieInfo.Actors}
    `);
        });
        break;
}