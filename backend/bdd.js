// const mysql = require ('pg');

const {Pool,Client} = require('pg');

const client = new Client({

  database:'proyecto',
  user: 'postgres',
  password: 'admin',
  host: 'localhost',
  port: 5432
})


client.connect();

module.exports = client;