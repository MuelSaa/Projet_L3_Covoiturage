//Non-blocking PostgreSQL client
const { Client } = require('pg');
const connectionString =process.env.CONNECTING_STRING+"?sslmode=no-verify";
var client = new Client(connectionString);

exports.client = client;
exports.connectionString = connectionString;