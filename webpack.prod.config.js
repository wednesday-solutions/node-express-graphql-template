// Important modules this config uses
const path = require('path');

module.exports = require('./webpack.server.config')({
  mode: 'production',
  entry: [path.join(process.cwd(), 'server/index.js')],

  optimization: {
    minimize: true,
    nodeEnv: 'production',
    sideEffects: false,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          }
        }
      }
    }
  },

  plugins: [
    // Minify and optimize the index.html
  ],

  performance: {
    assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename)
  }
});
