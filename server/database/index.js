const { Client } = require('pg');
let client;
export const connect = () => {
    client = new Client({ connectionString: process.env.DB_URL });
    client.connect();
};
export { client };
