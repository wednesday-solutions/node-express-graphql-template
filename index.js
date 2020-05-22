const dotEnvFile =
    process.env.NODE_ENV === 'production'
        ? `.env`
        : `.env.${process.env.NODE_ENV}`;

require('dotenv').config({ path: dotEnvFile });
// Run all scripts with ESM syntax support.
module.exports = require('esm')(module /* , options */)('./server/index.js'); // Start server
