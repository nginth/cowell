'use strict';
var request = require('request-promise'); 

function search(params, access_token, type) {
    // hack to support default params
    type = (type || 'album');
    let qs = 'q=';
    if (params.album) {
        qs = qs.concat(`album:${encodeQs(params.album)}`);
    }
    if (params.artist) {
        if (qs.slice(-1) !== '=') qs.concat('%20');
        qs = qs.concat(`artist:${encodeQs(params.artist)}`);
    }
    qs = qs.concat(`&type=${type}`);
    const options = {
        uri: `https://api.spotify.com/v1/search?${qs}`,
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        json: true
    }
    return request.get(options);
}

function encodeQs(str) {
    return str.replace(' ', '+');
}

module.exports = {
    search: search
}
