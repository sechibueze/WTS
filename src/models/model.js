import { Pool } from 'pg';
// import debug from 'debug';

import dbConfig from '../db.config';

// const logger = debug('dev:model');

export default class Model {
  constructor(table) {
    //DB connection data is automatically picked from .env
    const connectionString = process.env.DATABASE_URL || dbConfig.dbURL;
    this.pool = new Pool({
      connectionString: connectionString,
    });
    this.table = table;
  }

  select(fields, clause = '') {
    const query = `SELECT ${fields} FROM ${this.table} ${clause}`;
    //logger(`${this.table} select query : `, query);
    return this.pool.query(query);

  }

  insert(fields, values, clause = '') {
    const query = `INSERT INTO ${this.table} (${fields}) VALUES (${values}) ${clause}`;
    logger(`${this.table} insert query : `, query);
    return this.pool.query(query);

  }

  update(field, value, constraint = '') {
    //UPDATE customers SET email = 'segoo@gmail.com', status = TRUE WHERE id = 5 RETURNING email;
    const query = `UPDATE ${this.table} SET ${field} = '${value}' ${constraint}`;
    logger(`${this.table} update query : `, query);
    return this.pool.query(query);

  }

  delete(clause) {
    const query = `DELETE FROM ${this.table} ${clause}`;
    logger(`${this.table} delete query : `, query);
    return this.pool.query(query);
  }

}
