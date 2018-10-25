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
  - [AsyncAny](#asyncany)
  - [Prefer](#prefer)
  - [preferObservable](#preferobservable)
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

// a task is an asynchronous function which either takes a `done` callback
const task = done => fs.stat(path, done)

// or returns a promise or observable
const task = () => fetch(url)

// asyncAny treats them uniformly and either passes the task's result to a callback
asyncAny(task, (error, result) => { ... })

// or returns it as a promise
const result = await asyncAny(task)
```

# DESCRIPTION

This module exports a function which provides a uniform way to handle tasks which
signal completion asynchronously — either by calling a callback, returning a promise,
or returning an [observable](https://github.com/tc39/proposal-observable).

## Why?

I wanted a lightweight version of [async-done](https://www.npmjs.com/package/async-done)
without the [bugs](https://github.com/gulpjs/async-done/issues/36), with smarter
handling of promises and observables, with an optional promise API, and with browser
support.

## Why Not?

async-any doesn't support event emitters, ChildProcess or other kinds of Node.js
[streams](https://github.com/substack/stream-handbook) (unless they also happen to
be [promises](https://github.com/sindresorhus/cp-file) or observables).
If you need support for these, use async-done.

# EXPORTS

## asyncAny (default)

**Signature**:

* asyncAny(task: (done: Errback) ⇒ Promise|Observable|void, callback: Errback) ⇒ void
* asyncAny(task: (done: Errback) ⇒ Promise|Observable|void) ⇒ Promise

```javascript
import asyncAny from 'async-any'

function runTask (task) {
    asyncAny(task, (error, result) => {
        if (!error) console.log('got result:', result)
    })
}

// or

async function runTask (task) {
    let result = await asyncAny(task)
    console.log('got result:', result)
}
```

Takes an asynchronous task (function) and a callback. The task is passed a `done`
["errorback"](http://thenodeway.io/posts/understanding-error-first-callbacks/)
function which can be used to signal completion. Alternatively, the task can return
a promise or an observable and will be deemed complete when that "future"
succeeds or fails.

Once the task has completed, its error/result is forwarded to the callback.
If the callback is omitted, a promise is returned, which is fulfilled/rejected
by the corresponding result/error.

If the task returns a value which is both a promise and an observable, it is
treated as a promise by default. This can be resolved in favor of the observable
by importing the [`preferObservable`](#preferobservable) function, which otherwise
behaves the same as the default export e.g.:

```javascript
import { preferObservable as asyncAny } from 'async-any'
```

Alternatively, more fine-grained control can be exercised by providing a resolution
strategy (function) to the [`AsyncAny`](#asyncany) builder:

```javascript
import { AsyncAny, Prefer } from 'async-any'

const asyncAny = AsyncAny(future => ...) // return Prefer.PROMISE or Prefer.OBSERVABLE
```

## AsyncAny

A builder for asyncAny functions which takes a strategy (function) as a parameter.
The strategy takes a future which is both a promise and an observable and returns
a [`value`](#prefer) which indicates whether it should be resolved as a promise or
an observable.

The [`asyncAny`](#asyncany-default) and [`preferObservable`](#preferobservable)
functions exported by this module can easily be recreated with this builder e.g.:

```javascript
import { AsyncAny, Prefer } from 'async-any'

const asyncAny = AsyncAny()
const preferObservable = AsyncAny(future => Prefer.OBSERVABLE)
```

## Prefer

**Type**:

```typescript
type Prefer = {
    PROMISE: any,
    OBSERVABLE: any,
}
```

An object containing two constant values which are used to resolve a tie-break
when a future is both a promise and an observable. Used in conjunction with the
[`AsyncAny`](#asyncany) builder to create a custom version of [`asyncAny`](#asyncany-default)
with fine-grained control over how it handles futures that are both promises
and observables:

```javascript
import { AsyncAny, Prefer } from 'async-any'

// always resolve the future as a promise
const asyncAny = AsyncAny(future => Prefer.PROMISE)

// always resolve the future as an observable
const asyncAny = AsyncAny(future => Prefer.OBSERVABLE)

// custom resolution
const asyncAny = AsyncAny(future => isFoo(future) ? Prefer.OBSERVABLE : Prefer.PROMISE)
```

## preferObservable

**Signature**:

* preferObservable(task: (done: Errback) ⇒ Promise|Observable|void, callback: Errback) ⇒ void
* preferObservable(task: (done: Errback) ⇒ Promise|Observable|void) ⇒ Promise

A version of [`asyncAny`](#asyncany-default) which treats futures that are both
promises and observables as observables rather than promises i.e. their
completion occurs when the observable is completed rather than when the promise
is fulfilled or rejected.

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

1.0.0

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2018 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](http://www.opensource.org/licenses/artistic-license-2.0.php).
