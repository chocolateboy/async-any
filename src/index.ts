import isPromise from 'is-promise'
import once      from 'tiny-once'

// a node.js-style error-first callback
type Callback<T> = (err: any, result?: T) => void;

 /*
  * a task is an async function which signals completion in one of the following
  * ways:
  *
  *  - returning a promise
  *  - calling the supplied `done` callback
  */
type PromiseTask<T> = () => PromiseLike<T>;
type CallbackTask<T> = (done: Callback<T>) => void;
type Task<T> = PromiseTask<T> | CallbackTask<T>;

/*
 * pipe the promise's error/result into the continuation callback
 */
function pipe<T>(promise: Promise<T>, continuation: Callback<T>) {
    const onFulfilled = (result?: T) => {
        continuation(null, result)
    }

    const onRejected = (error: any) => {
        // ensure a promise rejected with a falsey value isn't
        // interpreted as a success:
        // https://github.com/gulpjs/async-done/issues/42
        continuation(error || new Error('Promise rejected without Error'))
    }

    promise.then(onFulfilled, onRejected)
}

function asyncAny<T> (task: PromiseTask<T>, continuation: Callback<T>): void;
function asyncAny<T> (task: CallbackTask<T>, continuation: Callback<T>): void;
function asyncAny<T> (task: PromiseTask<T>): Promise<T>;
function asyncAny<T> (task: CallbackTask<T>): Promise<T>;
function asyncAny<T> (task: Task<T>, continuation?: Callback<T>) {
    let resolve: (value?: PromiseLike<T> | T) => void
    let reject: (error: any) => void

    let promise = new Promise<T>((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })

    const _done = (error: any, result?: T) => {
        if (error) {
            reject(error)
        } else {
            resolve(result)
        }
    }

    const done = once(_done)
    const result = task(done)

    if (isPromise(result)) {
        promise = Promise.resolve(result) // PromiseLike -> Promise
    }

    return continuation ? pipe(promise, continuation) : promise
}

export default asyncAny
