'use strict'
var constants = require('./constants.js')

function handleError (err, res) {
    // FIXME: better error handling
    // TODO: switch on the type of error, render a pretty page for each
  console.log((err || err.error))
  res.render('error', {baseUrl: constants.BASE_URL})
}

module.exports = {
  handleError: handleError
}
