import asyncAny                 from '../dist/async-any.js'
import { ERROR, RESULT, sleep } from './_helpers.js'
import test                     from 'ava'
import Observable               from 'zen-observable'

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

test.cb('pass a falsey result when rejecting a callback', t => {
    t.plan(2)

    function reject (done) {
        sleep().then(() => {
            done(ERROR, false)
        })
    }

    function callback (error, result) {
        t.is(error, ERROR)
        t.is(result, false)
        t.end()
    }

    asyncAny(reject, callback)
})

test.cb('pass a truthy result when rejecting a callback', t => {
    t.plan(2)

    function reject (done) {
        sleep().then(() => {
            done(ERROR, true)
        })
    }

    function callback (error, result) {
        t.is(error, ERROR)
        t.is(result, true)
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

test.cb('return a hybrid promise (✔) / observable (x)', t => {
    t.plan(3)

    function resolve () {
        // reject the observable and resolve the promise
        const observer = new Observable(observer => {
            sleep().then(() => {
                t.fail()
                observer.error(ERROR)
            })
        })

        observer.then = function (onFulfilled, onRejected) {
            t.pass()
            onFulfilled(RESULT)
        }

        return observer
    }

    function callback (error, result) {
        t.falsy(error)
        t.is(result, RESULT)
        t.end()
    }

    asyncAny(resolve, callback)
})

test.cb('return a hybrid promise (x) / observable (✔)', t => {
    t.plan(3)

    function reject () {
        // resolve the observable and reject the promise
        const observer = new Observable(observer => {
            sleep().then(() => {
                t.fail()
                observer.next(RESULT)
                observer.complete()
            })
        })

        observer.then = function (onFulfilled, onRejected) {
            t.pass()
            onRejected(ERROR)
        }

        return observer
    }

    function callback (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, callback)
})
