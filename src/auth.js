'use strict'
var request = require('request-promise')

function getSpotifyToken (clientId, clientSecret, refreshToken) {
  const options = {
    uri: 'https://accounts.spotify.com/api/token',
    form: {
      'refresh_token': refreshToken,
      'grant_type': 'refresh_token'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(clientId + ':' + clientSecret).toString('base64'))
    },
    json: true
  }
  return request.post(options)
}

module.exports = {
  getSpotifyToken: getSpotifyToken
}
