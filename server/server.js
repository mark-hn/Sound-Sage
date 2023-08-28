const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const config = require('./config.json');

// Obtain secrets from ./config.json within the server
app.get('/secrets', (req, res) => {
    res.json(config);
});


// Refresh the access token using refresh token obtained from the client
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    const spotifyAPI = new SpotifyWebApi({
        redirectUri: config.REDIRECT_URI,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        refreshToken: refreshToken
    });

    spotifyAPI.refreshAccessToken()
        .then(
            (data) => {
                res.json({
                    accessToken: data.body.access_token,
                    expiresIn: data.body.expires_in,
                })
            })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        })
});


// Obtain the access token using the authorization code obtained from the client
app.post('/login', function (req, res) {
    const code = req.body.code;
    const spotifyAPI = new SpotifyWebApi({
        redirectUri: config.REDIRECT_URI,
        clientId: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET
    });

    spotifyAPI.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            });
        }).catch(error => {
            console.log(error);
            res.sendStatus(400);
        });
});

app.listen(3001);