const debug = process.env.NODE_ENV === 'debug'

module.exports = {
    env: {
        development: {
            sourceMaps: true,
            plugins: ['source-map-support'],
        }
    },

    presets: [
        'bili/babel',

        ['@babel/preset-env', {
            // smarter, smaller backports
            bugfixes: true,

            // don't use any polyfills
            useBuiltIns: (debug ? 'usage' : false),

            // set this to true to see the applied transforms and bundled polyfills
            debug: debug,

            corejs: (debug ? 3 : undefined),
        }]
    ],

    plugins: [],
}
