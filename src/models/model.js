import debug from 'debug';
const logger = debug('dev:model');
const { pool } = require('./DBTables');

export default class Model {
  constructor(table) {
    this.table = table;
    this.pool = pool;
  }

  select(fields, clause = '') {
    const query = `SELECT ${fields} FROM ${this.table} ${clause}`;
    logger(`${this.table} select query : `, query);
    return this.pool.query(query);

  }
  prepareFields(arr) {
    let newFields = [];
    arr.forEach((val, index) => {
      let num = `${index + 1}`;
      newFields.push('$' + num);
    });
    return newFields.join(', ');
  }
  insert(fields, values, clause = '') {
    const placeholder = this.prepareFields(values);//Object.keys(fields);
    const query = `INSERT INTO ${this.table} (${fields}) VALUES (${placeholder}) ${clause}`;
    logger(`${this.table} insert query : `, query, values);
    return this.pool.query(query, values);
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
