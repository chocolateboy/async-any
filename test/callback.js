import asyncAny from '../dist/async-any.js'
import test     from 'ava'

const { DELAY, ERROR, RESULT } = require('./config.json')

function resolve (done) {
    setTimeout(() => done(null, RESULT), DELAY)
}

function reject (done) {
    setTimeout(() => done(ERROR), DELAY)
}

test.cb('continuation (✔)', t => {
    t.plan(2)

    function continuation (error, result) {
        t.falsy(error)
        t.is(result, RESULT)
        t.end()
    }

    asyncAny(resolve, continuation)
})

test.cb('continuation (x)', t => {
    t.plan(2)

    function continuation (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, continuation)
})

test('promise (✔)', t => {
    t.plan(1)

    function onFulfilled (result) {
        t.is(result, RESULT)
    }

    function onRejected (error) {
        t.fail()
    }

    return asyncAny(resolve).then(onFulfilled, onRejected)
})

test('promise (x)', t => {
    t.plan(1)

    function onFulfilled (result) {
        t.fail()
    }

    function onRejected (error) {
        t.is(error, ERROR)
    }

    return asyncAny(reject).then(onFulfilled, onRejected)
})
