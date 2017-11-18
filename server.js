// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


//-------------------------------------------------------------//

// init Spotify API wrapper
var SpotifyWebApi = require('spotify-web-api-node');

// Replace with your redirect URI, required scopes, and show_dialog preference
var redirectUri = 'http://localhost:8888/callback/';
var scopes = ['user-top-read'];
var showDialog = true;

var id = 'cdebafbca1df44048ca43691aabae756';
var secret = '9388bacd84dc407a939d167c9c5daa55';

// The API object we'll use to interact with the API
var spotifyApi = new SpotifyWebApi({
  clientId : id,
  clientSecret : secret,
  redirectUri : redirectUri
});
spotifyApi.clientId = id;
spotifyApi.redirect = secret;
console.log(spotifyApi.clientId);

app.get("/authorize", function (request, response) {
  var authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, showDialog);
  console.log(authorizeURL)
  response.send(authorizeURL);
});

// Exchange Authorization Code for an Access Token
app.get("/callback", function (request, response) {
  var authorizationCode = request.query.code;
  
  spotifyApi.authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    response.redirect(`/#access_token=${data.body['access_token']}&refresh_token=${data.body['refresh_token']}`)
  }, function(err) {
    console.log('Something went wrong when retrieving the access token!', err.message);
  });
});

//-------------------------------------------------------------//
var listener = app.listen(8888, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
// listen for requests :)
/*var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});*/
