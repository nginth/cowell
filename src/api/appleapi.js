'use strict'
var request = require('request-promise')

function search (params) {
  const qs = []
  qs.push('term=')
  if (params.album) {
    qs.push(encodeQs(params.album))
  }
  if (params.artist) {
    if (qs.slice(-1) !== '=') qs.push('+')
    qs.push(encodeQs(params.artist))
  }
  qs.push('&entity=album&media=music')
  const options = {
    uri: `https://itunes.apple.com/search?${qs.join('')}`
  }
  return request.get(options)
        .then((appleRes) => {
          return JSON.parse(appleRes)
        })
}

function encodeQs (str) {
  return str.replace(' ', '+')
}

module.exports = {
  search: search
}
