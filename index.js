'use strict';
var express = require('express');

const app = express()
const PORT = (process.env.PORT || 8080)

app.get('/', (req, res) => {
    res.send('hello express')
})

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})