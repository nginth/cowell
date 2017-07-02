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
    return request.get(options)
        .then((searchRes) => {
            return {
                template: 'albums',
                templateArgs: {
                    albums: searchRes.albums.items,
                    albumName: query.album
                }
            }
        });
}

function albumArtistSearch(query, access_token) {
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
    return request.get(options)
        .then((searchRes) => {
            return {
                template: 'albums',
                templateArgs: {
                    albums: searchRes.albums.items,
                    albumName: query.album,
                    artistName: query.artist
                }
            }
        });
}

function encodeQs(str) {
    return str.replace(' ', '%20');
}

function isEmpty(str) {
    return str === '' || typeof str === 'undefined' || str === null;
}

module.exports = {
    handleSearch: handleSearch
}