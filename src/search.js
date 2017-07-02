'use strict';
var request = require('request-promise');

function handleSearch(query, access_token) {
    if (isEmpty(query.artist)) {
        return albumSearch(query, access_token);
    } else if (!isEmpty(query.album)) {
        return albumArtistSearch(query, access_token);
    }
}

function albumSearch(query, access_token) {
    return Promise.all([spotifyAlbumSearch(query, access_token), appleAlbumSearch(query)])
        .then((responses) => {
            return {
                template: 'albums',
                templateArgs: {
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

function albumArtistSearch(query, access_token) {
    return Promise.all([spotifyAlbumArtistSearch(query, access_token), appleAlbumArtistSearch(query)])
        .then((responses) => {
            console.log(JSON.stringify(responses[1]));
            return {
                template: 'albums',
                templateArgs: {
                    albumName: query.album,
                    spotify: {
                        albums: responses[0].albums.items
                    },
                    apple: {
                        albums: responses[1].results
                    }
                }
            }
        });
}

function appleAlbumSearch(query) {
    const encodedAlbum = encodeQs(query.album);
    const options = {
        uri: `https://itunes.apple.com/search?term=${encodedAlbum}&entity=album&media=music`,
    }
    return request.get(options)
        .then((appleRes) => {
            return JSON.parse(appleRes);
        });
}

function appleAlbumArtistSearch(query) {
    const encodedAlbum = encodeQs(query.album);
    const encodedArtist = encodeQs(query.artist);
    const options = {
        uri: `https://itunes.apple.com/search?term=${encodedAlbum}+${encodedArtist}&entity=album&media=music`,
    }
    return request.get(options)
        .then((appleRes) => {
            return JSON.parse(appleRes);
        });
}

function spotifyAlbumSearch(query, access_token) {
    const options = {
        uri: 'https://api.spotify.com/v1/search',
        qs: {
            'q': encodeQs(query.album),
            'type': 'album'
        },
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    }
    return request.get(options);
}

function spotifyAlbumArtistSearch(query, access_token) {
    const encodedAlbum = encodeQs(query.album);
    const encodedArtist = encodeQs(query.artist);
    const qs = `q=album:${encodedAlbum}%20artist:${encodedArtist}&type=album`;

    const options = {
        uri: `https://api.spotify.com/v1/search?${qs}`,
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    }
    console.log(access_token);
    return request.get(options);
}

function encodeQs(str) {
    return str.replace(' ', '+');
}

function isEmpty(str) {
    return str === '' || typeof str === 'undefined' || str === null;
}

module.exports = {
    handleSearch: handleSearch
}