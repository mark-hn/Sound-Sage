import { useEffect, useState } from 'react';
import Artist from './artist';
import ClipLoader from 'react-spinners/ClipLoader';
import './App.css'
import { Container } from 'react-bootstrap'
import axios from 'axios';


export default function Recommend({ artists, accessToken }) {
    const [recommendationsData, setRecommendationsData] = useState(() => {
        const localValue = localStorage.getItem("ITEMS");
        if (localValue == null) return [];
        return JSON.parse(localValue);
    });

    if (recommendationsData.length === 0) {
        let artistLst = [];
        artists.map(item => (
            artistLst.push(item.name)
        ));
        const artistStr = artistLst.join(", ");

        axios
            .post("https://sound-sage-ai.onrender.com:3001/recommend", { artist_str: artistStr, access_token: accessToken })
            .then(res => {
                setRecommendationsData(res.data.data);
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

            {recommendationsData.length !== 0 && (
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
