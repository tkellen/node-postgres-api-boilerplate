import fs from 'fs';
import path from 'path';

import pgp from './pgp';

export function load (basePath) {
  return fs.readdirSync(basePath).reduce((result, queryFile) => {
    const query = path.basename(queryFile, '.sql');
    result[query] = pgp.QueryFile(path.join(basePath, queryFile));
    return result;
  }, {});
}

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

export function destroy (table) {
  return `DELETE FROM ${pgp.as.name(table)} WHERE id=$[id]`;
}
