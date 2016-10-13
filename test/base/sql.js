/* global describe, it, before, after */

// TODO fix tableName
import { expect } from 'chai';
import * as migrate from '../helpers/migrate';
import fixtures from '../helpers/fixtures';
import * as sql from '../../src/base/sql';

import db from '../../src/services/db';

describe ('base/sql', () => {
  before(() => {
    migrate.up();
    return fixtures();
  });

  after(() => {
    migrate.reset();
  });

  describe ('create', () => {
    it ('should accept an Array of column names', () => {
      const tableName = 'state';
      const fields = ['abbr', 'name'];
      const insertQuery = sql.create(tableName, fields);
      expect(insertQuery).to.be.a('string');
      expect(insertQuery).to.contain('$[abbr]');
      expect(insertQuery).to.contain('RETURNING *');
    });
    it ('should accept an object with columns and values', () => {
      const tableName = 'state';
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const insertQuery = sql.create(tableName, data);
      expect(insertQuery).to.be.a('string');
      expect(insertQuery).to.contain('FICKLE');
      expect(insertQuery).to.contain('RETURNING *');
    });
    it ('should return a valid INSERT query', () => {
      const tableName = 'state';
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const insertQuery = sql.create(tableName, data);
      return db.one(insertQuery).then(result => {
        expect(result).to.be.an('object').and.to.contain.keys([
          'abbr', 'name', 'id', 'created_at'
        ]);
      });
    });
  });

  describe ('update', () => {
    //var stateID;
    // before (() => {
    //   const tableName = pgp.helpers('state';
    //   const query = 'SELECT * FROM
    // });
    it ('should accept an Array of column names', () => {
      const tableName = 'state';
      const fields = ['abbr', 'name'];
      const updateQuery = sql.update(tableName, fields);
      expect(updateQuery).to.be.a('string');
      expect(updateQuery).to.contain('$[abbr]');
      expect(updateQuery).to.contain('RETURNING *');
    });
    it ('should accept an object with columns and values', () => {
      const tableName = 'state';
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const updateQuery = sql.update(tableName, data);
      expect(updateQuery).to.be.a('string');
      expect(updateQuery).to.contain('FICKLE');
      expect(updateQuery).to.contain('RETURNING *');
    });
    it.skip ('should return a valid UPDATE query', () => {
      const tableName = 'state';
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const insertQuery = sql.create(tableName, data);
      return db.one(insertQuery).then(result => {
        expect(result).to.be.an('object').and.to.contain.keys([
          'abbr', 'name', 'id', 'created_at'
        ]);
      });
    });
  });

});
