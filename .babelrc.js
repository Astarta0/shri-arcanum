const isNode = typeof window === 'undefined';
module.exports = {
  "presets": [
    "@babel/preset-react",
    ["@babel/env", {
      modules: isNode ? 'auto' : false,
      loose: true,
      useBuiltIns: 'usage',
      corejs: 3
    }],
    "@babel/typescript"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    "@babel/plugin-proposal-export-default-from",
    "@babel/proposal-object-rest-spread",
    "@babel/plugin-transform-runtime",
    ["module-resolver", {
      "root": ["./"],
      "alias": {
        "src": "./src"
      }
    }]
  ]
};
