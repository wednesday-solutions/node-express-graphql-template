module.exports = {
    "env": {
        "test": {
            "plugins": ["@babel/plugin-transform-modules-commonjs"]
        }
    },
    "presets": [
        "@babel/preset-env"
    ],
    "plugins": [
        "@babel/plugin-transform-runtime"
    ]
}
