const pSleep = require('p-sleep')

const DELAY  = 50
const ERROR  = 'Error!'
const RESULT = 42
const sleep  = (delay = DELAY) => pSleep(delay)

module.exports = { DELAY, ERROR, RESULT, sleep }
