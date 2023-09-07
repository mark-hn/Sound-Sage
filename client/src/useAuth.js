import { useEffect, useState } from 'react';
import axios from 'axios';


export default function useAuth(code) {
    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    // Post the access/refresh token and expiration date to the server
    useEffect(() => {
        axios
            .post("https://sound-sage-ai.onrender.com/login", {
                code,
            })
            .then(res => {
                setAccessToken(res.data.accessToken);
                setRefreshToken(res.data.refreshToken);
                setExpiresIn(res.data.expiresIn);
                window.history.pushState({}, null, '/Sound-Sage-AI/');
            })
            .catch(() => {
                window.location = '/Sound-Sage-AI/';
            })
    }, [code])

    // Automatically send refresh request to the server 60 seconds before expiration date
    useEffect(() => {
        if (!refreshToken || !expiresIn) return;
        const interval = setInterval(() => {

            axios
                .post("https://sound-sage-ai.onrender.com/refresh", {
                    refreshToken,
                })
                .then(res => {
                    setAccessToken(res.data.accessToken);
                    setExpiresIn(res.data.expiresIn);
                })
                .catch(() => {
                    window.location = '/Sound-Sage-AI/';
                })
        }, (expiresIn - 60) * 1000);

        return () => clearInterval(interval);
    }, [refreshToken, expiresIn])

    return accessToken;
}