'use strict';
var request = require('request-promise');

function getSpotifyToken(client_id, client_secret, refresh_token) {
    const options = {
        uri: 'https://accounts.spotify.com/api/token',
        form: {
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token',
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    }
    return request.post(options);
}

module.exports = {
    getSpotifyToken: getSpotifyToken
}