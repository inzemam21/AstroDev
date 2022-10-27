const NodeGeoCoder = require('node-geocoder')

const options = {
    provider: 'mapquest',
    httpAdapter: 'https',
    apiKey: "jdE3ovVRmb4nuxQKGSP9XwnPzbGOYGww",
    formatter: null,
}

const geocoder = NodeGeoCoder(options)

module.exports = geocoder