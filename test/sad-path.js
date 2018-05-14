import asyncAny   from '../dist/async-any.js'
import test       from 'ava'
import Observable from 'zen-observable'

const { DELAY, ERROR, RESULT } = require('./config.json')

test.cb('resolve multiple times', t => {
    t.plan(2)

    function resolve (done) {
        setTimeout(() => {
            done(null, RESULT)
            done(null, RESULT)
        }, DELAY)
    }

    function continuation (error, result) {
        t.falsy(error)
        t.is(result, RESULT)
        t.end()
    }

    asyncAny(resolve, continuation)
})

test.cb('reject multiple times', t => {
    t.plan(2)

    function reject (done) {
        setTimeout(() => {
            done(ERROR)
            done(ERROR)
        }, DELAY)
    }

    function continuation (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, continuation)
})

test.cb('pass a falsey second value when rejecting', t => {
    t.plan(2)

    function reject (done) {
        setTimeout(() => {
            done(ERROR, false)
        }, DELAY)
    }

    function continuation (error, result) {
        t.is(error, ERROR)
        t.is(result, false)
        t.end()
    }

    asyncAny(reject, continuation)
})

test.cb('pass a truthy second value when rejecting', t => {
    t.plan(2)

    function reject (done) {
        setTimeout(() => {
            done(ERROR, true)
        }, DELAY)
    }

    function continuation (error, result) {
        t.is(error, ERROR)
        t.is(result, true)
        t.end()
    }

    asyncAny(reject, continuation)
})

test.cb('pass a falsey error when rejecting a promise', t => {
    t.plan(2)

    function reject () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(false) // eslint-disable-line prefer-promise-reject-errors
            }, DELAY)
        })
    }

    function continuation (error, result) {
        t.truthy(error)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, continuation)
})

test.cb('return a hybrid promise (✔) / observable (x)', t => {
    t.plan(3)

    function resolve () {
        // reject the observable and resolve the promise
        const observer = new Observable(observer => {
            setTimeout(() => {
                t.fail()
                observer.error(ERROR)
            }, DELAY)
        })

        observer.then = function (onFulfilled, onRejected) {
            t.pass()
            onFulfilled(RESULT)
        }

        return observer
    }

    function continuation (error, result) {
        t.falsy(error)
        t.is(result, RESULT)
        t.end()
    }

    asyncAny(resolve, continuation)
})

test.cb('return a hybrid promise (x) / observable (✔)', t => {
    t.plan(3)

    function reject () {
        // resolve the observable and reject the promise
        const observer = new Observable(observer => {
            setTimeout(() => {
                t.fail()
                observer.next(RESULT)
                observer.complete()
            }, DELAY)
        })

        observer.then = function (onFulfilled, onRejected) {
            t.pass()
            onRejected(ERROR)
        }

        return observer
    }

    function continuation (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, continuation)
})
