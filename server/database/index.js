const { Client } = require('pg');
let client;
export const connect = () => {
    client = new Client({
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB
    });
    client.connect(err => {
        if (err) {
            console.log('Database connection error', err);
        } else {
            console.log('connected to databaser', {
                host: process.env.POSTGRES_HOST,
                user: process.env.POSTGRES_USER,
                database: process.env.POSTGRES_DB
            });
        }
    });
};
export { client };
