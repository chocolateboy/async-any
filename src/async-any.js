import isObservable        from 'is-observable'
import isPromise           from 'is-promise'
import observableToPromise from 'observable-to-promise'
import once                from 'onetime'

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

function asyncAny (task, callback) {
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

    // prefer promise if the result is both a promise and an observable:
    // https://github.com/gulpjs/async-done/issues/36
    // https://github.com/avajs/ava/blob/v1.0.0-beta.4/lib/assert.js#L345-L351
    //
    // XXX isObservable is currently buggy with RxJS@6 observables
    // https://github.com/sindresorhus/is-observable/issues/1#issuecomment-387843191
    if (isObservable(result) && !isPromise(result)) {
        result = observableToPromise(result)
    }

    if (isPromise(result)) {
        pipePromise(result, done)
    }

    return promise
}

module.exports = asyncAny
