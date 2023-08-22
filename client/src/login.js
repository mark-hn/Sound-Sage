import React from 'react'
import { Container } from 'react-bootstrap'

const config = require('./config.json');

const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${config.CLIENT_ID}&response_type=code&redirect_uri=${config.REDIRECT_URI}&scope=user-top-read`

// Login button on home page
export default function Login() {
    return (
        <Container>
            <a className='btn btn-success btn-lg' href={AUTH_URL}>
                Login with Spotify
            </a>
        </Container>
    )
}