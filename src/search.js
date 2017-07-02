'use strict';
var request = require('request-promise');
var spotifyAPI = require('./spotifyapi.js');
var appleAPI = require('./appleapi.js');

function handleSearch(query, access_token) {
    const params = {
        album: query.album,
        artist: query.artist
    }
    return Promise.all([spotifyAPI.search(params, access_token), appleAPI.search(params)])
        .then((responses) => {
            return {
                template: 'albums',
                templateArgs: {
                    albumName: (query.album || query.artist),
                    spotify: {
                        albums: responses[0].albums.items,
                        albumName: query.album
                    },
                    apple: {
                        albums: responses[1].results
                    }
                }
            }
        });
}

module.exports = {
    handleSearch: handleSearch
}