/*****
 *  This module defines the DATABASE source for test environment
 *  in Travis CI build. It uses make-runnable package and written in ES5
 *  
 *  The data source for production is found in db.Config.js
 *  
 *  process.env.DB_CONNECT is set in Travis config vars
 */
const pg = require('pg');

let connection = process.env.DATABASE_URL || 'postgresql://postgres:christinme@localhost:5432/wts_test';//process.env.DB_CONNECT || process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: connection
});

pool.on('connect', () => console.log('DBTables:connected to DB with : ', connection));


// TBquery : a collection of CREATE TABLE queries for DB
// Optionally specify the < project > 
const util = (TBquery, project = '') => {
  pool.query(TBquery)
    .then(result => {
      console.log(`success: created ${project} tables`);
      pool.end();
    })
    .catch(e => {
      console.log(`error: failed to create ${project} tables`, e);
      pool.end();
    });
}

const createTables = () => {
  const tableQuery = `
  -- Create Users Table 
    CREATE TABLE IF NOT EXISTS
    users(
      user_id SERIAL NOT NULL PRIMARY KEY,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT FALSE,
      entry_date DATE NOT NULL DEFAULT NOW()
    );

  ---Create bus tables
    CREATE TABLE IF NOT EXISTS bus(
    bus_id SERIAL NOT NULL PRIMARY KEY,
    plate_number VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL,
    seats INTEGER[] NOT NULL
  );

  ---Create Trips table with custom type [state]
    DO $$ BEGIN 
      CREATE TYPE state AS ENUM('active', 'cancelled');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE TABLE IF NOT EXISTS trips(
      --data datatype constraint clause
      trip_id SERIAL NOT NULL PRIMARY KEY,
      bus_id INTEGER NOT NULL,
      origin VARCHAR(255) NOT NULL,
      destination VARCHAR(255) NOT NULL,
      fare FLOAT NOT NULL,
      trip_date DATE NOT NULL CHECK (trip_date > NOW()),
      state state DEFAULT 'active', 
      FOREIGN KEY(bus_id) REFERENCES bus(bus_id)
    ); 

  CREATE TABLE IF NOT EXISTS Bookings(
      booking_id SERIAL NOT NULL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      trip_id INTEGER NOT NULL,
      bus_id INTEGER NOT NULL,
      trip_date DATE NOT NULL,
      seat_number INTEGER NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      origin VARCHAR(255) NOT NULL,
      destination VARCHAR NOT NULL,
      fare FLOAT NOT NULL,
      FOREIGN KEY(trip_id) REFERENCES trips(trip_id)
  )
  `;
  // Run the Query
  util(tableQuery, 'WTS');
}

// Export for use in command line
module.exports = {
  createTables,
  pool
};
require('make-runnable');