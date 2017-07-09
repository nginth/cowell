'use strict'
var express = require('express')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var auth = require('./src/auth.js')
var search = require('./src/search.js')
var error = require('./src/error.js')
var constants = require('./src/constants.js')
var redis = require('redis')
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

const PORT = (process.env.PORT || 8080)
const REDIS_PORT = (process.env.REDIS_URL || 6379)
const RECENT_LIST = 'recents'
const RECENT_SIZE = 10

const app = express()
const redisClient = redis.createClient(REDIS_PORT)

app.use(express.static('assets'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  redisClient.lrangeAsync(RECENT_LIST, 0, RECENT_SIZE - 1)
    .then((keys) => {
      const templateArgs = {title: 'Cowell', BASE_URL: constants.BASE_URL}
      if (keys != null) {
        templateArgs.recentSearches = []
        keys.forEach((key) => {
          const keySplit = key.split('^')
          templateArgs.recentSearches.push({
            album: keySplit[0],
            artist: keySplit[1]
          })
        })
      }
      res.render('index', templateArgs)
    })
})

app.get('/search', cache, (req, res) => {
  auth.getSpotifyToken(process.env.SPOTIFY_CLIENT, process.env.SPOTIFY_SECRET, process.env.SPOTIFY_REFRESH)
        .then(authRes => search.handleSearch(req.query, authRes.access_token))
        .then((searchRes) => {
          searchRes.templateArgs.BASE_URL = constants.BASE_URL
          const key = `${req.query.album}^${req.query.artist}`
          redisClient.setex(key, 3600, JSON.stringify(searchRes))
          redisClient.lpush(RECENT_LIST, key)
          redisClient.ltrim(RECENT_LIST, 0, RECENT_SIZE - 1)
          res.render(searchRes.template, searchRes.templateArgs)
        })
        .catch(err => error.handleError(err, res))
})

app.get('/about', (req, res) => {
  res.render('about', {BASE_URL: constants.BASE_URL})
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})

function cache (req, res, next) {
  req.sanitize('album').escape()
  req.sanitize('album').trim()
  req.sanitize('artist').escape()
  req.sanitize('artist').trim()

  const key = `${req.query.album}^${req.query.artist}`
  console.log(key)
  redisClient.getAsync(key)
    .then(data => {
      if (data != null) {
        const searchRes = JSON.parse(data)
        searchRes.templateArgs.fetchUrl = search.fetchUrl
        searchRes.templateArgs.fetchFromObject = search.fetchFromObject
        res.render(searchRes.template, searchRes.templateArgs)
      } else {
        next()
      }
    })
    .catch(err => console.log(err))
}
