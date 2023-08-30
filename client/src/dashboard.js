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

import axios from 'axios';


export default function Dashboard({ code }) {
    const [topArtistData, setTopArtistData] = useState([]);
    const [view, setView] = useState(0);

    const accessToken = useAuth(code);

    useEffect(() => {
        if (!accessToken) return;

        axios
            .post("http://localhost:3001/top", { access_token: accessToken })
            .then(res => {
                setTopArtistData(res.data);
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

                    {topArtistData.length !== 0 && (
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
                    <BottomNavigationAction sx={[
                        { marginRight: '10%', color: '#dcffff' },
                        () => ({
                            '&:hover': { backgroundColor: '#2f2d38', transition: 'all 0.15s ease-out' }
                        })
                    ]} label="Top Artists" icon={<ListIcon />} />
                    <BottomNavigationAction sx={[
                        { marginLeft: '10%', color: '#dcffff' },
                        () => ({
                            '&:hover': { backgroundColor: '#2f2d38', transition: 'all 0.15s ease-out' }
                        })
                    ]} label="Recommended Artists" icon={<QueueMusicIcon />} />
                </BottomNavigation>
            </Paper>
        </>
    )
}