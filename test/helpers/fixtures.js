import db from '../../src/services/db';

import pgp from '../../src/base/pgp';

import data from '../fixtures/';

function resetSequence () {
  return Promise.all(Object.keys(data).map(table => {
    const tableName = new pgp.helpers.TableName(table);
    return db.one(`SELECT setval('${table}_id_seq', (SELECT MAX(id) FROM ${tableName}) )`);
  }));
}

export default function fixtures () {
  return Promise.all(Object.keys(data).map(table => {
    const insertQuery = pgp.helpers.insert(
      data[table],
      Object.keys(data[table][0]),
      table
    );
    return db.none(insertQuery);
  })).then(resetSequence);
}
