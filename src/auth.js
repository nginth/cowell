'use strict';
var request = require('request-promise');

function getSpotifyToken() {
    const options = {
        'uri': 'https://accounts.spotify.com/authorize',
        'qs': {
            'client_id': process.env.SPOTIFY_ID,
            'response_type': 'code',
            'redirect_uri': 'https://cowell.herokuapp.com/spotifycallback'
        }
    }
    return request(options);
}

module.exports = {
    getSpotifyToken: getSpotifyToken
}