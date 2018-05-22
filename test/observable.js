import asyncAny                 from '../dist/async-any.js'
import { ERROR, RESULT, sleep } from './_helpers.js'
import test                     from 'ava'
import Observable               from 'zen-observable'

function resolve () {
    return new Observable(observer => {
        sleep().then(() => {
            observer.next(RESULT)
            observer.complete()
        })
    })
}

function reject () {
    return new Observable(observer => {
        sleep().then(() => {
            observer.error(ERROR)
        })
    })
}

test.cb('callback (✔)', t => {
    t.plan(2)

    function callback (error, result) {
        t.falsy(error)
        t.deepEqual(result, [RESULT])
        t.end()
    }

    asyncAny(resolve, callback)
})

test.cb('callback (x)', t => {
    t.plan(2)

    function callback (error, result) {
        t.is(error, ERROR)
        t.falsy(result)
        t.end()
    }

    asyncAny(reject, callback)
})

test('promise (✔)', t => {
    t.plan(1)

    function onFulfilled (result) {
        t.deepEqual(result, [RESULT])
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
