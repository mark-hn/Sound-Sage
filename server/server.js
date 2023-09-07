const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// const dotenv = require('dotenv');
// dotenv.config();


// Obtain secrets from .env within the server
app.get('/url', (req, res) => {
    res.json({
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI
    });
});


// Refresh the access token using refresh token obtained from the client
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;

    const spotifyAPI = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
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
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
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


// Obtain top artists
app.post('/top', function (req, res) {
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    });

    spotifyApi.setAccessToken(req.body.access_token);

    const params = {
        time_range: "medium_term",
        limit: 20,
        offset: 0
    };

    spotifyApi.getMyTopArtists(params).then((response) => {
        topArtistData = response.body.items.map(item => {
            const smallestImg = item.images.reduce((smallest, img) => {
                if (img.height < smallest.height) return img;
                return smallest;
            })

            return {
                name: item.name,
                url: item.external_urls.spotify,
                genres: item.genres,
                image: smallestImg.url
            };
        });
        res.json(topArtistData);
    }).catch(err => {
        console.log(err);
        res.sendStatus(400)
    });
})


// Obtain recommended artists
app.post('/recommend', function (req, res) {
    const accessToken = req.body.access_token
    const artistStr = req.body.artist_str

    axios.post(
        `https://chimeragpt.adventblocks.cc/api/v1/chat/completions`,
        {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    "role": "system",
                    "content": "You are a Spotify artist recommender. User will input a list of artists they listen to. You will respond with a list of recommended artists of similar genres. Your list will be in a format similar to the input. Do not respond with anything other than the contents of the list. Each artist in your list must not be in the user's list. Each artist in your list must appear a maximum of one time."
                },
                {
                    "role": "user",
                    "content": artistStr
                }
            ]
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.CHIMERA_API_KEY}`
            }
        }
    ).then((response) => {
        const recommendations = response.data.choices[0].message.content.split(', ');

        async function getRecommendations() {
            let data = []
            for (let item of recommendations) {
                await axios.get('https://api.spotify.com/v1/search',
                    {
                        params: { q: item, type: 'artist', market: 'US', limit: 1, offset: 0 },
                        headers: { Authorization: `Bearer ${accessToken}` }
                    })
                    .then((artist) => {
                        if (artist.data.artists.items[0]) {
                            let item = artist.data.artists.items[0];

                            data.push({
                                name: item.name,
                                url: item.external_urls.spotify,
                                genres: item.genres,
                                image: item.images ? item.images[2].url : ""
                            });
                        }
                    });
            }
            res.json({ data });
        }

        getRecommendations();

    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
})


app.listen(3001);