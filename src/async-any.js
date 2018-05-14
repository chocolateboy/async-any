import isObservable        from 'is-observable'
import isPromise           from 'is-promise'
import observableToPromise from 'observable-to-promise'
import once                from 'onetime'

function handlePromise (promise, done) {
    const onFulfilled = result => { done(null, result) }
    const onRejected = error => {
        // ensure a promise rejected with a falsey value isn't
        // interpreted as a success:
        // https://github.com/gulpjs/async-done/issues/42
        done(error || new Error('Promise rejected without Error'))
    }

    promise.then(onFulfilled, onRejected)
}

function asyncAny (callback, continuation) {
    let promise

    if (!continuation) {
        promise = new Promise((resolve, reject) => {
            continuation = function (error, result) {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        })
    }

    const done = once(continuation)
    const result = callback(done)

    // prefer promise if the result is both a promise and an observable:
    // https://github.com/gulpjs/async-done/issues/36
    // https://github.com/avajs/ava/blob/e4446544f075c6613bae030f285b23181ddff1af/lib/assert.js#L345-L351
    if (isPromise(result)) {
        handlePromise(result, done)
    } // eslint-disable-line brace-style

    // XXX isObservable is currently buggy with RxJS@6 observables
    // https://github.com/sindresorhus/is-observable/issues/1#issuecomment-387843191
    else if (isObservable(result)) {
        handlePromise(observableToPromise(result), done)
    }

    return promise
}

module.exports = asyncAny
