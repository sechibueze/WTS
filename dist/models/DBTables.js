"use strict";

var pg = require('pg'); // const { Pool } = pg;
//const dbConfig = require('../db.config');


var connection = process.env.DATABASE_URL || 'postgresql://postgres:christinme@localhost:5432/wayfarer';
var pool = new pg.Pool({
  connectionString: connection
});
pool.on('connect', function () {
  return console.log('connected to DB');
});

var util = function util(TBquery) {
  var table = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  pool.query(TBquery).then(function (result) {
    console.log("success: created ".concat(table, "  table"));
    pool.end();
  })["catch"](function (e) {
    console.log("error: cannot create ".concat(table, "table"), e);
    pool.end();
  });
};

var createUsersTable = function createUsersTable() {
  var usersQuery = "CREATE TABLE IF NOT EXISTS \n    users(\n      user_id SERIAL NOT NULL PRIMARY KEY,\n      first_name VARCHAR(255) NOT NULL,\n      last_name VARCHAR(255) NOT NULL,\n      email VARCHAR(255) NOT NULL UNIQUE,\n      password VARCHAR(255) NOT NULL,\n      is_admin BOOLEAN DEFAULT FALSE,\n      entry_date DATE NOT NULL DEFAULT NOW()\n    )";
  util(usersQuery, 'users');
};

var createBusTable = function createBusTable() {
  var busQuery = "CREATE TABLE IF NOT EXISTS bus(\n  bus_id SERIAL NOT NULL PRIMARY KEY,\n  plate_number VARCHAR(255) NOT NULL,\n  manufacturer VARCHAR(255) NOT NULL,\n  model VARCHAR(255) NOT NULL,\n  year VARCHAR(255) NOT NULL,\n  capacity INTEGER NOT NULL CHECK (capacity > 0)\n)";
  util(busQuery, 'bus');
};

module.exports = {
  createUsersTable: createUsersTable,
  createBusTable: createBusTable
};

require('make-runnable');