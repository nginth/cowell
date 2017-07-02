'use strict';
var request = require('request-promise');
var spotifyAPI = require('./api/spotifyapi.js');
var appleAPI = require('./api/appleapi.js');
var tidalAPI = require('./api/tidalapi.js');

function handleSearch(query, access_token) {
    const params = {
        album: query.album,
        artist: query.artist
    }
    return Promise.all([spotifyAPI.search(params, access_token), appleAPI.search(params), tidalAPI.search(params)])
        .then((responses) => {
            console.log(responses[2].albums.items[0]);
            return {
                template: 'albums',
                templateArgs: {
                    queryAlbumName: (query.album || query.artist),
                    fetchFromObject: fetchFromObject,
                    fetchUrl: fetchUrl,
                    apis: [
                        {
                            apiName: 'Spotify',
                            albums: responses[0].albums.items,
                            albumName: 'name',
                            albumUrl: 'external_urls.spotify',
                            imageUrl: 'images.2.url',
                            artistUrl: 'external_urls.spotify',
                            artists: 'artists',
                            artistName: 'name',
                            imageWidth: '60px',
                            imageHeight: '60px'
                        },
                        {   
                            apiName: 'Apple Music',
                            albums: responses[1].results,
                            albumName: 'collectionName',
                            albumUrl: 'collectionViewUrl',
                            imageUrl: 'artworkUrl60',
                            artistUrl: 'artistViewUrl',
                            artistName: 'artistName',
                            imageWidth: '60px',
                            imageHeight: '60px'
                        },
                        {
                            apiName: 'Tidal',
                            albums: responses[2].albums.items,
                            albumName: 'title',
                            albumUrl: 'url',
                            imageUrl: 'cover',
                            imageUrlPrefix: 'https://resources.wimpmusic.com/images/',
                            imageUrlSuffix: '/80x80.jpg',
                            artists: 'artists',
                            artistUrl: 'id',
                            artistUrlPrefix: 'http://www.tidal.com/artist/',
                            artistName: 'name',
                            imageWidth: '60px',
                            imageHeight: '60px'
                        }
                    ]
                }
            }
        });
}

function fetchUrl(obj, prop, prefix, suffix) {
    prefix = (prefix || '');
    suffix = (suffix || '');
    let url = fetchFromObject(obj, prop);
    if (prefix.indexOf('wimpmusic') !== -1) url = url.replace(/-/g, '/');
    return prefix + url + suffix;
}

function fetchFromObject(obj, prop) {
  //property not found
  if (typeof obj === 'undefined') return false;

  //index of next property split
  var _index = prop.indexOf('.')

  //property split found; recursive call
  if (_index > -1) {
    //get object at property (before split), pass on remainder
    return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
  }

  //no split; get property
  return obj[prop];
}

module.exports = {
    handleSearch: handleSearch
}