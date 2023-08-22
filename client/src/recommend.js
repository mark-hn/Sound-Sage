import { useEffect, useState } from 'react';
import axios from 'axios';
import config from './config.json';
import Artist from './artist';


export default function Recommend({ artists, accessToken }) {

    const [recommendationsData, setRecommendationsData] = useState([]);

    const API_KEY = config.CHIMERA_API_KEY;

    useEffect(() => {
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
                        "content": "You are a Spotify artist recommender. User will input a list of artists they listen to. You will respond with a list of recommendations that are not in the input list. Your list will be in a format similar to the input. Do not respond with anything other than the contents of the list. Your list should not have any duplicates."
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
                console.log(recommendationsData);
            })
        }).catch((err) => {
            console.log(err);
        });
    }, [artists]);

    return (
        <div>
            <div>
                {recommendationsData.map(item => (
                    <Artist artist={item} key={item.url} />
                ))}
            </div>
            <br /><br />
        </div>
    )
}
