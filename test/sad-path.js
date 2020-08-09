const test                     = require('ava')
const asyncAny                 = require('..')
const { ERROR, RESULT, sleep } = require('./_helpers.js')

test.cb('resolve multiple times', t => {
    t.plan(2)

    function resolve (done) {
        sleep().then(() => {
            done(null, RESULT)
            done(null, RESULT)
        })
    }

    function callback (error, result) {
        t.falsy(error)
        t.is(result, RESULT)
        t.end()
    }

    asyncAny(resolve, callback)
})

test.cb('reject multiple times', t => {
    t.plan(2)

    function reject (done) {
        sleep().then(() => {
            done(ERROR)
            done(ERROR)
        })
    }

    function callback (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, callback)
})

test.cb('pass a falsey error when rejecting a promise', t => {
    t.plan(2)

    function reject () {
        return new Promise((resolve, reject) => {
            sleep().then(() => {
                reject(false) // eslint-disable-line prefer-promise-reject-errors
            })
        })
    }

    function callback (error, result) {
        t.truthy(error)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, callback)
})
