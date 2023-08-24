import { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config.json';
import Artist from './artist';
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css'
import { Container } from 'react-bootstrap'


export default function Recommend({ artists, accessToken }) {

    const [recommendationsData, setRecommendationsData] = useState(() => {
        const localValue = localStorage.getItem("ITEMS");
        if (localValue == null) return [];
        return JSON.parse(localValue);
    });

    const API_KEY = config.CHIMERA_API_KEY;

    if (recommendationsData.length === 0) {
        let artistLst = [];
        artists.map(item => (
            artistLst.push(item.name)
        ));
        const artistStr = artistLst.join(", ");

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
                    Authorization: `Bearer ${API_KEY}`
                }
            }
        ).then((res) => {
            const recommendations = res.data.choices[0].message.content.split(', ');

            let data = []
            async function search() {
                for (let item of recommendations) {
                    await axios.get('https://api.spotify.com/v1/search',
                        { params: { q: item, type: 'artist', market: 'US', limit: 1, offset: 0 }, headers: { Authorization: `Bearer ${accessToken}` } })

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
            }
            search().then(() => {
                setRecommendationsData(data);
            })
        }).catch((err) => {
            console.log(err);
        });
    }


    useEffect(() => {
        localStorage.setItem("ITEMS", JSON.stringify(recommendationsData));
    }, [recommendationsData]);


    return (
        <div>
            {recommendationsData.length === 0 && (
                <div>
                    <center><h1>Generating recommendations...</h1></center>
                    <center className="loader-container">
                        <ClipLoader color={'#fff'} size={75} />
                    </center>
                </div>
            )}

            {recommendationsData.length != 0 && (
                <div>
                    <center>
                        <h1>Here are your recommended artists:</h1>

                        <Container>
                            <a className='btn btn-success btn-lg' onClick={() => {
                                localStorage.setItem("ITEMS", null);
                                setRecommendationsData([]);
                            }}>
                                Regenerate recommendations
                            </a>
                        </Container>
                    </center>

                    {recommendationsData.map(item => (
                        <Artist artist={item} key={item.url} />
                    ))}
                    <br /><br />
                </div>
            )}
        </div>
    )
}
