const pg = require('pg');
// const { Pool } = pg;
//const dbConfig = require('../db.config');
const connection = process.env.DATABASE_CONNECT || 'postgresql://postgres:christinme@localhost:5432/wayfarer';
const pool = new pg.Pool({
  connectionString: connection
});
pool.on('connect', () => console.log('connected to DB'))

const util = (TBquery, table = '') => {
  pool.query(TBquery)
    .then(result => {
      console.log(`success: created ${table}  table`);
      pool.end();
    })
    .catch(e => {
      console.log(`error: cannot create ${table}table`, e);
      pool.end();
    });
}

const createUsersTable = () => {
  const usersQuery = `CREATE TABLE IF NOT EXISTS 
    users(
      user_id SERIAL NOT NULL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      entry_date DATE NOT NULL DEFAULT NOW()
    )`;
  util(usersQuery, 'users');

}

const createBusTable = () => {
  const busQuery = `CREATE TABLE IF NOT EXISTS bus(
  bus_id SERIAL NOT NULL PRIMARY KEY,
  plate_number VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  year VARCHAR(255) NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0)
)`;
  util(busQuery, 'bus');
}

module.exports = {
  createUsersTable,
  createBusTable
};

require('make-runnable');