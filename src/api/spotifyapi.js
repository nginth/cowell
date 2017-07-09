'use strict'
var request = require('request-promise')

function search (params, accessToken, type) {
    // hack to support default params
  type = (type || 'album')
  const qs = ['q=']
  if (params.album) {
    qs.push(`album:${encodeQs(params.album)}`)
  }
  if (params.artist) {
    if (qs.slice(-1) !== '=') qs.push('%20')
    qs.push(`artist:${encodeQs(params.artist)}`)
  }
  qs.push(`&type=${type}`)
  const options = {
    uri: `https://api.spotify.com/v1/search?${qs.join('')}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    json: true
  }
  return request.get(options)
}

function encodeQs (str) {
  return str.replace(' ', '+')
}

module.exports = {
  search: search
}
