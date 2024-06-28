module.exports = function(api) {
  api.cache(true); // Caches the computed configuration

  const presets = ['@babel/preset-env', '@babel/preset-flow'];
  const plugins = [
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-class-properties',
    '@babel/transform-runtime'
  ];

  // Environment-specific configuration
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env !== 'test') {
    plugins.push([
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@server': './server',
          '@root': '',
          '@utils': './server/utils',
          '@middleware': './server/middleware',
          '@services': './server/services',
          '@daos': './server/daos',
          '@database': './server/database',
          '@gql': './server/gql',
          '@config': './config'
        }
      }
    ]);
  }

  return {
    presets,
    plugins
  };
};
