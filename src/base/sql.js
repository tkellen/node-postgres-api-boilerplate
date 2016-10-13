import fs from 'fs';
import path from 'path';

import pgp from './pgp';

/**
 * Create `QueryFile` objects out of all files in `basePath`. Generate an
 * object containing those `QueryFile`s, keyed by the source SQL file's
 * basename.
 * @TODO: What happens here if any files in `basePath` are not valid SQL?
 * @param {string} basePath
 * @return {object}  keyed `QueryFile` objects
 */
export function load (basePath) {
  return fs.readdirSync(basePath).reduce((result, queryFile) => {
    const query = path.basename(queryFile, '.sql');
    result[query] = pgp.QueryFile(path.join(basePath, queryFile));
    return result;
  }, {});
}

/**
 * Return SQL query to read all or a single record (by ID) from `table`
 * @param {string} table
 * @param [{Number|String}] Optional parseInt-able ID for read-single.
 * @return {string}
 */
export function read (table, id) {
  const tableName = new pgp.helpers.TableName(table);
  const isSingle = (!isNaN(id = parseInt(id, 10)));
  if (isSingle) {
    return pgp.as.format(
      `SELECT * FROM ${tableName} WHERE id = $1`,
      id
    );
  } else {
    return `SELECT * FROM ${tableName}`;
  }
}

/**
 * Return SQL query for creating a new record in `table`.
 * `fields` can be either an Array of column names or an object of values
 * keyed by column name.
 * @param {string} table
 * @param {object|Array} fields  If object, will be treated as key->value pairs
 *                               If array, will be treated as column names only
 * @return {string}              Parameterized query if `fields` is Array
 *                               Complete query string if `fields` is object
 */
export function create (table, fields) {
  if (Array.isArray(fields)) { // TODO: deprecate this variant
    const columns = fields.map(pgp.as.name).join(',');
    const setters = fields.map(field => `$[${field}]`).join(',');
    return `INSERT INTO ${pgp.as.name(table)} (${columns}) VALUES (${setters}) RETURNING *`;
  } else {
    const insertQuery = pgp.helpers.insert(
      fields,
      Object.keys(fields),
      table
    );
    return `${insertQuery} RETURNING *`;
  }
}

/**
 * Like `create`, this method accepts either an object or Array for `fields`.
 * @param {string} table
 * @param {Array|object} fields
 * @return {string}              `id` is parameterized
 */
export function update (table, fields) {
  if (Array.isArray(fields)) {
    const setters = fields.map(field => {
      return `${pgp.as.name(field)}=$[${field}]`;
    }).join(', ');
    return `UPDATE ${pgp.as.name(table)} SET ${setters} WHERE id=$[id] RETURNING *`;
  } else {
    const updateQuery = pgp.helpers.update(
      fields,
      Object.keys(fields),
      table
    );
    return `${updateQuery} WHERE id=$[id] RETURNING *`;
  }
}

/**
 * Return an SQL query string to delete a record.
 * @param {string} table
 * @return {string}       `id` is parameterized
 */
export function destroy (table) {
  return `DELETE FROM ${pgp.as.name(table)} WHERE id=$[id]`;
}
