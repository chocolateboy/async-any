# async-any

[![Build Status](https://travis-ci.org/chocolateboy/async-any.svg)](https://travis-ci.org/chocolateboy/async-any)
[![NPM Version](https://img.shields.io/npm/v/async-any.svg)](https://www.npmjs.org/package/async-any)

<!-- toc -->

- [NAME](#name)
- [FEATURES](#features)
- [INSTALLATION](#installation)
- [SYNOPSIS](#synopsis)
- [DESCRIPTION](#description)
  - [Why?](#why)
  - [Why Not?](#why-not)
- [TYPES](#types)
- [EXPORTS](#exports)
  - [asyncAny (default)](#asyncany-default)
- [DEVELOPMENT](#development)
  - [NPM Scripts](#npm-scripts)
- [COMPATIBILITY](#compatibility)
- [SEE ALSO](#see-also)
- [VERSION](#version)
- [AUTHOR](#author)
- [COPYRIGHT AND LICENSE](#copyright-and-license)

<!-- tocstop -->

# NAME

async-any - manage various forms of asynchronous completion in a uniform way

# FEATURES

  - more lightweight than [async-done](https://www.npmjs.com/package/async-done)
  - works in Node.js and the browser
  - fully typed (TypeScript)

# INSTALLATION

    $ npm install async-any

# SYNOPSIS

```javascript
import asyncAny from 'async-any'

// a task is an asynchronous function which either takes a `done` callback
const task = done => fs.stat(path, done)

// or returns a promise
const task = () => fetch(url)

// asyncAny treats them uniformly and either passes the task's result to a callback
asyncAny(task, (error, result) => { ... })

// or returns it as a promise
const result = await asyncAny(task)
```

# DESCRIPTION

This module exports a function which provides a uniform way to handle tasks
which signal completion asynchronously, either by calling a callback or
returning a promise.

## Why?

I needed a lightweight version of
[async-done](https://www.npmjs.com/package/async-done) with an optional promise
API and browser support.

## Why Not?

async-any doesn't support event emitters, observables, ChildProcess or other
kinds of Node.js [streams](https://github.com/substack/stream-handbook) (unless
they [also](https://github.com/sindresorhus/cp-file) happen to be promises). If
you need support for these, use an adapter such as
[event-to-promise](https://www.npmjs.com/package/event-to-promise) or
[observable-to-promise](https://www.npmjs.com/package/observable-to-promise),
or use async-done.

# TYPES

The following types are referenced in the descriptions below.

```typescript
type Callback<T> = (err: any, result?: T) => void;
type PromiseTask<T> = () => PromiseLike<T>;
type CallbackTask<T> = (done: Callback<T>) => void;
type Task<T> = PromiseTask<T> | CallbackTask<T>;
```

# EXPORTS

## asyncAny (default)

**Signature**:

- `asyncAny<T>(task: Task<T>, callback: Callback<T>): void`
- `asyncAny<T>(task: Task<T>): Promise<T>`

```javascript
import asyncAny from 'async-any'

function runTask (task) {
    asyncAny(task, (error, result) => {
        if (!error) console.log('got result:', result)
    })
}

// or

async function runTask (task) {
    const result = await asyncAny(task)
    console.log('got result:', result)
}
```

Takes an asynchronous task (function) and an optional callback. The task is
passed a `done`
["errorback"](https://thenodeway.io/posts/understanding-error-first-callbacks/)
function which can be used to signal completion. Alternatively, the task can
return a promise and is deemed complete when it succeeds or fails.

Once the task has completed, its error/result is forwarded to the callback. If
the callback is omitted, a promise is returned, which is fulfilled/rejected by
the task's corresponding result/error.

# DEVELOPMENT

<details>

## NPM Scripts

The following NPM scripts are available:

- build - compile the library for testing and save to the target directory
- build:release - compile the library for release and save to the target directory
- clean - remove the target directory and its contents
- doctoc - generate the README's TOC (table of contents)
- rebuild - clean the target directory and recompile the library
- test - recompile the library and run the test suite
- test:run - run the test suite
- typecheck - sanity check the library's type definitions

</details>

# COMPATIBILITY

The following [targets](https://browserl.ist/?q=Maintained+Node+versions%2C+Last+2+Chrome+versions%2C+Last+2+Safari+versions%2C+Firefox+ESR) are supported:

- Firefox ESR
- Last 2 Chrome versions
- Last 2 Safari versions
- [Maintained Node.js versions](https://github.com/nodejs/Release#readme)

# SEE ALSO

* [always-done](https://www.npmjs.com/package/always-done)
* [async-done](https://www.npmjs.com/package/async-done)
* [function-done](https://www.npmjs.com/package/function-done)

# VERSION

2.0.0

# AUTHOR

[chocolateboy](mailto:chocolate@cpan.org)

# COPYRIGHT AND LICENSE

Copyright © 2019-2020 by chocolateboy.

This is free software; you can redistribute it and/or modify it under the
terms of the [Artistic License 2.0](https://www.opensource.org/licenses/artistic-license-2.0.php).
