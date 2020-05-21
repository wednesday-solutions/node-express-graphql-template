const databaseConfig = require('config/config');

module.exports = {
    apps: [
        {
            name: 'Node Template',
            script: 'index.js',
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
                PORT: 9001,
                watch: true,
                DB_URI: databaseConfig.development.url,
                DB_OPTIONS: JSON.stringify(databaseConfig.development.options)
            }
        }
    ]
};
