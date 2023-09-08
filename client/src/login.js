import { useState } from 'react';
import { Container } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';

// Login button on home page
export default function Login() {
    const [AUTH_URL, setAUTH_URL] = useState(undefined);
    axios
        .get("https://sound-sage-ai.onrender.com/url")
        .then(res => {
            setAUTH_URL(`https://accounts.spotify.com/authorize?client_id=${res.data.CLIENT_ID}&response_type=code&redirect_uri=${res.data.REDIRECT_URI}&scope=user-top-read`);
        }).catch(err => {
            console.error(err);
        });

    return (
        <>
            {!AUTH_URL && (
                <div>
                    <center><h1>Loading...</h1></center>
                    <center className="loader-container">
                        <ClipLoader color={'#fff'} size={75} />
                    </center>
                </div>
            )}

            {AUTH_URL && (
                <Container>
                    <a className='btn btn-success btn-lg' href={AUTH_URL}>
                        Login with Spotify
                    </a>
                </Container>
            )}
        </>
    )
}