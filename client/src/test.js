import config from './config.json';
import SpotifyWebApi from 'spotify-web-api-node';


const spotifyApi = new SpotifyWebApi({
    redirectUri: config.REDIRECT_URI,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
});

function searchArtist(name, accessToken) {
    spotifyApi.setAccessToken(accessToken);
    console.log(accessToken);

    let params = {
        limit: 1,
        offset: 0
    }

    spotifyApi.searchArtists(name, params).then((res) => {
        let item = res.body.artists.items[0];
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
    })
}

searchArtist('Man with a Mission', )