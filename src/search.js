'use strict';
var request = require('request-promise');
var spotifyAPI = require('./api/spotifyapi.js');
var appleAPI = require('./api/appleapi.js');
var tidalAPI = require('./api/tidalapi.js');

function handleSearch(query, access_token) {
    const params = {
        album: query.album,
        artist: query.artist
    }
    return Promise.all([spotifyAPI.search(params, access_token), appleAPI.search(params), tidalAPI.search(params)])
        .then((responses) => {
            console.log(responses[2].albums.items[0]);
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
                    },
                    tidal: {
                        albums: responses[2].albums.items
                    }
                }
            }
        });
}

module.exports = {
    handleSearch: handleSearch
}