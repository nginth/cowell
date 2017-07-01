'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var qs = require('querystring');
var auth = require('./src/auth.js');
var request = require('request-promise');

const PORT = (process.env.PORT || 8080);
const BASE_URL = 'http://localhost:8080';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    console.log(process.env.SPOTIFY_CLIENT);
    res.render('index', {loginUrl: BASE_URL + '/spotifylogin', title: 'Cowell'});
});

app.get('/spotifylogin', (req, res) => {
    console.log('/spotifylogin');
    var query = qs.stringify({
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT,
        redirect_uri: `${BASE_URL}/spotifycallback`,
    });
    res.redirect(`https://accounts.spotify.com/authorize?${query}`);
});

app.get('/spotifycallback', (req, res) => {
    console.log('redirected');
    console.log(req.query.code);
    const options = {
        uri: 'https://accounts.spotify.com/api/token',
        form: {
            'grant_type': 'authorization_code',
            'code': req.query.code,
            'redirect_uri': `${BASE_URL}/spotifycallback`
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFY_CLIENT + ':' + process.env.SPOTIFY_SECRET).toString('base64'))
        },
        json: true
    }
    request.post(options)
        .then(body => res.send(body));
});

app.get('/search', (req, res) => {
    req.checkQuery('album', 'Please enter an album name.').notEmpty();

    req.sanitize('album').escape();
    req.sanitize('album').trim();

    auth.getSpotifyToken(process.env.SPOTIFY_CLIENT, process.env.SPOTIFY_SECRET, process.env.SPOTIFY_REFRESH)
        .then((authRes) => {
            const options = {
                uri: 'https://api.spotify.com/v1/search',
                qs: {
                    'q': req.query.album,
                    'type': 'album'
                },
                headers: {
                    'Authorization': `Bearer ${authRes.access_token}`
                },
                json: true
            }
            return request.get(options);
        })
        .then(body => res.send(body))
        .catch(err => console.log(err));
});
 
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
