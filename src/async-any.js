import isObservable        from 'is-observable'
import isPromise           from 'is-promise'
import observableToPromise from 'observable-to-promise'
import once                from 'onetime'

const Prefer = { PROMISE: [], OBSERVABLE: [] }

const Strategy = {
    preferPromise:    future => Prefer.PROMISE,
    preferObservable: future => Prefer.OBSERVABLE,
}

// pipe the promise's result/error to the callback
function pipePromise (promise, done) {
    const onFulfilled = result => { done(null, result) }
    const onRejected = error => {
        // ensure a promise rejected with a falsey value isn't
        // interpreted as a success:
        // https://github.com/gulpjs/async-done/issues/42
        done(error || new Error('Promise rejected without Error'))
    }

    promise.then(onFulfilled, onRejected)
}

function AsyncAny (strategy = Strategy.preferPromise) {
    return function asyncAny (task, callback) {
        let promise

        if (!callback) {
            promise = new Promise((resolve, reject) => {
                callback = function (error, result) {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                }
            })
        }

        const done = once(callback)
        let result = task(done)

        // XXX isObservable is currently buggy with RxJS@6 observables
        // https://github.com/sindresorhus/is-observable/issues/1#issuecomment-387843191
        if (isObservable(result)) {
            if (!isPromise(result) || (strategy(result) === Prefer.OBSERVABLE)) {
                result = observableToPromise(result)
            }
        }

        if (isPromise(result)) {
            pipePromise(result, done)
        }

        return promise
    }
}

// by default, prefer promise if the result is both a promise and an observable:
// https://github.com/gulpjs/async-done/issues/36
// https://github.com/avajs/ava/blob/v1.0.0-beta.4/lib/assert.js#L345-L351
const asyncAny = AsyncAny()

// but allow the observable's completion to be preferred over that of
// the promise via a separate export
const preferObservable = AsyncAny(Strategy.preferObservable)

module.exports = Object.assign(asyncAny, { AsyncAny, Prefer, preferObservable })
