import db from '../../src/services/db';

import pgp from '../../src/base/pgp';

const data = {
  state: require('../fixtures/state')
};

function resetSequence () {
  return Promise.all(Object.keys(data).map(table => {
    return db.task(t => {
      const tableName = new pgp.helpers.TableName(table);
      return t.one('SELECT MAX(id) FROM $1', tableName).then(result => {
        return t.func('setval', [`${table}_id_seq`, result.max]);
      });
    });
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
