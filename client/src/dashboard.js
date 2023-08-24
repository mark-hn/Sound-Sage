import { useState, useEffect } from 'react';
import useAuth from './useAuth';
import SpotifyWebApi from 'spotify-web-api-node';

import Artist from './artist';
import Recommend from './recommend';
import './App.css';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';

import config from './config.json';


const spotifyApi = new SpotifyWebApi({
    redirectUri: config.REDIRECT_URI,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
});

export default function Dashboard({ code }) {
    const accessToken = useAuth(code);
    const [topArtistData, setTopArtistData] = useState([]);

    const [view, setView] = useState(0);

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);

        const params = {
            time_range: "medium_term",
            limit: 20,
            offset: 0
        };

        spotifyApi.getMyTopArtists(params).then((res) => {
            setTopArtistData(res.body.items.map(item => {
                const smallestImg = item.images.reduce((smallest, img) => {
                    if (img.height < smallest.height) return img;
                    return smallest;
                })

                return {
                    name: item.name,
                    url: item.external_urls.spotify,
                    genres: item.genres,
                    image: smallestImg.url
                }
            }));
        }).catch(err => {
            console.log(err);
        });
    }, [accessToken]);

    if (topArtistData.length === 0) return;

    return (
        <>
            {view === 0 && (
                <div>
                    {topArtistData.length === 0 && (
                        <center>
                            <h1>Unable to obtain your top artists</h1>
                            <h2>Your Spotify account may be new or unfrequently used in the past 6 months</h2>
                        </center>
                    )}

                    {topArtistData.length != 0 && (
                        <>
                            <center><h1>Here are your top artists ranked by calculated affinity:</h1></center>
                            <div>
                                {topArtistData.map(item => (
                                    <Artist artist={item} key={item.url} />
                                ))}
                            </div>
                            <br /><br />
                        </>
                    )}
                </div>
            )}

            {view === 1 && (
                <div>
                    <Recommend artists={topArtistData} accessToken={accessToken} />
                </div>
            )}

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                <BottomNavigation
                    sx={{ backgroundColor: '#201f27' }}
                    showLabels
                    value={view}
                    onChange={(event, newView) => {
                        setView(newView);
                    }}
                >
                    <BottomNavigationAction sx={{ marginRight: '10%', color: '#dcffff' }} label="Top Artists" icon={<ListIcon />} />
                    <BottomNavigationAction sx={{ marginLeft: '10%', color: '#dcffff' }} label="Recommended Artists" icon={<QueueMusicIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    )
}