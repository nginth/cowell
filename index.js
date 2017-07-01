'use strict';
var express = require('express');
var auth = require('./src/auth.js');

const app = express();
const PORT = (process.env.PORT || 8080);

app.set('view engine', 'pug');

app.get('/', (req, res) => {
    auth.getSpotifyToken()
        .then(res => console.log(res));
});
 
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
