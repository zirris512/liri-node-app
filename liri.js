require("dotenv").config();
var keys = require("./keys.js");
console.log(keys);
var spotify = new Spotify(keys.spotify);