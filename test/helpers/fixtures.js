import db from '../../src/services/db';
import * as baseSql from '../../src/base/sql';

const data = {
  state: require('../fixtures/state')
};

export default function fixtures () {
  // Array of promises representing table-insert batch transactions
  const insertPromises = [];
  for (const table in data) {
    // Insert data for each table
    insertPromises.push(db.tx(t => {
      return t.batch(data[table].map(insert => {
        const fields = Object.keys(insert);
        const sql = baseSql.create(table, fields);
        return db.one(sql, insert);
      }));
    }));
  }
  return Promise.all(insertPromises);
}
