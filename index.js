'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var qs = require('querystring');
var auth = require('./src/auth.js');
var search = require('./src/search.js');
var error = require('./src/error.js');
var constants = require('./src/constants.js');
var request = require('request-promise');

const PORT = (process.env.PORT || 8080);

const app = express();

app.use(express.static('assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', {title: 'Cowell', BASE_URL: constants.BASE_URL});
});


app.get('/search', (req, res) => {    
    req.sanitize('album').escape();
    req.sanitize('album').trim();
    req.sanitize('artist').escape();
    req.sanitize('artist').trim();

    auth.getSpotifyToken(process.env.SPOTIFY_CLIENT, process.env.SPOTIFY_SECRET, process.env.SPOTIFY_REFRESH)
        .then(authRes => search.handleSearch(req.query, authRes.access_token))
        .then((searchRes) => {
            searchRes.templateArgs.BASE_URL = constants.BASE_URL;
            res.render(searchRes.template, searchRes.templateArgs)
        })
        .catch(err => error.handleError(err, res));
});

app.get('/about', (req, res) => {
    res.render('about', {BASE_URL: constants.BASE_URL});
});
 
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
