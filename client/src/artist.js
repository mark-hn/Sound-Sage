import React from 'react';
import './App.css';

export default function Artist({ artist }) {
    function handleClick() {
        return (
            window.open(artist.url, '_blank')
        )
    }

    return (
        <center>
            <div
                className='d-flex m-2 align-items-center artist-button'
                onClick={handleClick}
            >
                <img src={artist.image} style={{ height: '64px', width: '64px' }} />
                <div className='artist-text'>
                    <div>{artist.name}</div>
                    <div style={{ color: 'grey' }}>Genres: {artist.genres.join(', ')}</div>
                </div>
            </div>
        </center>)
}