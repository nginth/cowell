'use strict';
var request = require('request-promise');

function search(params) {
    let qs = 'term=';
    if (params.album) {
        qs = qs.concat(encodeQs(params.album));
    }
    if (params.artist) {
        if (qs.slice(-1) !== '=') qs.concat('+');
        qs = qs.concat(encodeQs(params.artist));
    }
    qs = qs.concat('&entity=album&media=music');
    const options = {
        uri: `https://itunes.apple.com/search?${qs}`,
    }
    return request.get(options)
        .then((appleRes) => {
            return JSON.parse(appleRes);
        });
}

function encodeQs(str) {
    return str.replace(' ', '+');
}

module.exports = {
    search: search
}