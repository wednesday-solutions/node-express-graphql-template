const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
  parser: 'babel-eslint',
  extends: ['prettier-standard'],
  plugins: ['prettier'],
  env: {
    jest: true,
    browser: true,
    node: true,
    es6: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  rules: {
    'import/no-webpack-loader-syntax': 0,
    curly: ['error', 'all'],
    'key-spacing': [2, { beforeColon: false, afterColon: true }],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'import/imports-first': 0,
    'import/newline-after-import': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': 0,
    'import/no-named-as-default': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'no-param-reassign': 0,
    'max-len': 0,
    'newline-per-chained-call': 0,
    'no-confusing-arrow': 0,
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'no-unused-vars': 2,
    'no-use-before-define': 0,
    'prefer-template': 2,
    'require-yield': 0,
    'node/handle-callback-err': 'error',
    'prettier/prettier': ['error', prettierOptions]
  },
  settings: {
    'import/resolver': {
      node: {
        app: './app',
        context: 'app',
        resolve: {
          app: './app',
          paths: ['app'],
          modules: ['app', 'node_modules'],
          extensions: ['.js', '.json', '.coffee']
        }
      }
    }
  }
};
