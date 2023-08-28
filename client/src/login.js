import { useState } from 'react'
import { Container } from 'react-bootstrap'
import axios from 'axios';

// Login button on home page
export default function Login() {
    const [AUTH_URL, setAUTH_URL] = useState(null);
    axios
        .get("http://localhost:3001/secrets")
        .then(res => {
            setAUTH_URL(`https://accounts.spotify.com/authorize?client_id=${res.data.CLIENT_ID}&response_type=code&redirect_uri=${res.data.REDIRECT_URI}&scope=user-top-read`);
        });

    return (
        <Container>
            <a className='btn btn-success btn-lg' href={AUTH_URL}>
                Login with Spotify
            </a>
        </Container>
    )
}