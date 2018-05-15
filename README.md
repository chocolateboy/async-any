# async-any

[![Build Status](https://secure.travis-ci.org/chocolateboy/async-any.svg)](http://travis-ci.org/chocolateboy/async-any)
[![NPM Version](http://img.shields.io/npm/v/async-any.svg)](https://www.npmjs.org/package/async-any)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [NAME](#name)
- [INSTALLATION](#installation)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
  - [Why?](#why)
  - [Why Not?](#why-not)
- [EXPORTS](#exports)
  - [asyncAny (default)](#asyncany-default)
- [DEVELOPMENT](#development)
  - [NPM Scripts](#npm-scripts)
  - [Gulp Tasks](#gulp-tasks)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# NAME

async-any - manage various forms of asynchronous completion in a uniform way

# INSTALLATION

    $ npm install async-any

# SYNOPSIS

```javascript
import asyncAny from 'async-any'

// async task taking a `done` callback
asyncAny(
    done => get(id, done),
    (error, result) => {
        if (!error) console.log(result)
    }
)

// async task returning a promise or observable
asyncAny(
    () => fetch(url),
    (error, result) => { ... }
)

// returns a promise if the callback is omitted
const result = await asyncAny(done => get(id, done))
```

# DESCRIPTION

This module exports a function which provides a uniform way to handle tasks which
signal completion asynchronously — either by calling a callback, returning a promise,
or returning an [observable](https://github.com/tc39/proposal-observable).

It takes a callback and a continuation function. The callback is passed a `done`
["errorback"](http://thenodeway.io/posts/understanding-error-first-callbacks/)
function which can be used to signal completion. Alternatively, the callback can
return a promise or an observable and will be deemed complete once that "future"
succeeds or fails.

Once the completion of the callback is signaled by one of these methods, the final
error/result is forwarded to the continuation. If the continuation is omitted,
a promise is returned which is fulfilled/rejected by the corresponding result/error.

## Why?

I wanted a lightweight version of [async-done](https://www.npmjs.com/package/async-done)
without the [bugs](https://github.com/gulpjs/async-done/issues/36), with stricter detection
of promises and observables, with an optional promise API, and with browser support.

## Why Not?

async-any doesn't support event emitters, ChildProcess or other kinds of Node.js
[streams](https://github.com/substack/stream-handbook) (unless they also happen to
be [promises](https://github.com/sindresorhus/cp-file) or observables).
If you need support for these, use async-done.

# EXPORTS

## asyncAny (default)

**Signature**: `asyncAny(callback: (done: Errback) ⇒ Promise|Observable|void, continuation: Errback) ⇒ void`

**Signature**: `asyncAny(callback: (done: Errback) ⇒ Promise|Observable|void) ⇒ Promise`

```javascript
function getResource (id) {
    asyncAny(done => get(id, done), (error, result) => {
        if (!error) console.log('got result:', result)
    })
}

// or

async function getResource (id) {
    const result = await asyncAny(done => get(id, done))
    console.log('got result:', result)
}
```

Takes a callback which is passed a Node-style "errorback" function. Once the callback is complete,
its error and result are passed into the continuation.

Completion of the callback is signalled by calling `done`, or on the fulfilment or rejection of its
return value if it returns a promise or observable. If a continuation function isn't supplied,
a promise is returned which is fulfilled by the result or rejected by the error.

If the callback returns a value which is both a promise and an observable, it is treated as a promise.

# DEVELOPMENT

<details>

## NPM Scripts

The following NPM scripts are available:

* test - lint the codebase, compile the library, and run the test suite

## Gulp Tasks

The following Gulp tasks are available:

* build - compile the library and save it to the target directory
* clean - remove the target directory and its contents
* default - run the `lint` and `build` tasks
* dump:config - print the build config settings to the console
* lint - check and report style and usage errors in the gulpfile, source file(s) and test file(s)

</details>

# SEE ALSO

* [always-done](https://www.npmjs.com/package/always-done)
* [async-done](https://www.npmjs.com/package/async-done)
* [function-done](https://www.npmjs.com/package/function-done)

# VERSION

0.0.2

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
