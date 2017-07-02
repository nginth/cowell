'use strict';
var request = require('request-promise');

function search(params, type) {
    const options = {
        uri: 'https://api.tidalhifi.com/v1/login/username',
        headers: {
            'X-Tidal-Token': process.env.TIDAL_TOKEN
        },
        form: {
            username: process.env.TIDAL_USER,
            password: process.env.TIDAL_PASS
        }
    }
    return request.post(options)
        .then((rawRes) => {
            const login = JSON.parse(rawRes);
            const qs = (params.album || '') + ' ' + (params.artist || '');
            return {
                uri: 'https://api.tidalhifi.com/v1/search',
                headers: {
                    'Origin': 'http://listen.tidal.com',
                    'X-Tidal-SessionId': login.sessionID,
                    'X-Tidal-Token': process.env.TIDAL_TOKEN
                },
                qs: {
                    query: qs,
                    limit: 50,
                    types: type || 'albums',
                    offset: 0,
                    countryCode: login.countryCode
                }
            }
        })
        .then(res => request.get(res))
        .then((tidalRes) => JSON.parse(tidalRes));
}

module.exports = {
    search: search
}
