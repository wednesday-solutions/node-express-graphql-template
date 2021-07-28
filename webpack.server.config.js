/**
 * COMMON WEBPACK CONFIGURATION
 */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

const dotEnvFile =
  process.env.ENVIRONMENT_NAME === 'production' ? `.env` : `.env.${process.env.ENVIRONMENT_NAME || 'local'}`;

console.log({ dotEnvFile });

const env = dotenv.config({ path: dotEnvFile }).parsed;

const envKeys = {
  ...Object.keys(process.env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
    return prev;
  }, {}),
  ...Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {})
};

module.exports = (options = {}) => ({
  mode: options.mode,
  entry: options.entry,
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery
        }
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true
            }
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-loader'
      },
      {
        test: /\.(mp4|webm)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }
    ]
  },
  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new webpack.DefinePlugin(envKeys)
  ]),
  resolve: {
    modules: ['node_modules', 'app'],
    alias: {
      moment$: path.resolve(__dirname, './node_modules/moment/moment.js'),
      '@root': '.',
      '@server': path.resolve(__dirname, './server'),
      '@utils': path.resolve(__dirname, './server/utils'),
      '@middleware': path.resolve(__dirname, './server/middleware'),
      '@daos': path.resolve(__dirname, './server/daos'),
      '@database': path.resolve(__dirname, './server/database'),
      '@gql': path.resolve(__dirname, './server/gql'),
      '@config': path.resolve(__dirname, 'config')
    },
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main']
  },
  target: 'node'
});
