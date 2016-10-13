/* global describe, it, before, after */

import { expect } from 'chai';
import path from 'path';
import * as migrate from '../helpers/migrate';
import fixtures from '../helpers/fixtures';
import * as sql from '../../src/base/sql';

import db from '../../src/services/db';

describe ('base/sql', () => {
  const tableName = 'state';

  before(() => {
    migrate.up();
    return fixtures();
  });

  after(() => {
    migrate.reset();
  });

  describe('load', () => {
    var queries;
    before (() => {
      queries = sql.load(path.join(__dirname, '../fixtures/queries'));
    });
    it ('should load each SQL file as a QueryFile', () => {
      expect(queries).to.be.an('object');
      Object.keys(queries).forEach(query => {
        // Test for presence of readonly `query` attr
        expect(queries[query].query).to.be.ok;
      });
    });
  });

  describe ('read', () => {
    describe ('read many', () => {
      it ('should return a SELECT query to read all', () => {
        const selectQuery = sql.read(tableName);
        expect(selectQuery).to.be.a('string');
        expect(selectQuery).to.contain('*');
        expect(selectQuery).to.contain(tableName);
        expect(selectQuery).to.contain('SELECT');
      });
      it ('should return a valid SELECT query', () => {
        const selectQuery = sql.read(tableName);
        return db.many(selectQuery).then(result => {
          expect(result).to.be.an('Array');
          expect(result.length).to.be.at.least(50);
          expect(Object.keys(result[0])).to.contain('abbr', 'id', 'name');
        });
      });
    });

    describe ('read one', () => {
      it ('should return a SELECT query to read a single record', () => {
        const selectQuery = sql.read(tableName, 1);
        expect(selectQuery).to.be.a('string');
        expect(selectQuery).to.contain('1');
        expect(selectQuery).to.contain('WHERE');
      });
      it ('should return a SELECT-all query if ID invalid type', () => {
        const selectQuery = sql.read(tableName, 'florp');
        expect(selectQuery).to.be.a('string');
        expect(selectQuery).not.to.contain('id');
        expect(selectQuery).not.to.contain('WHERE');
      });
      it ('should return a valid SELECT query', () => {
        const selectQuery = sql.read(tableName, 1);
        return db.one(selectQuery).then(result => {
          expect(result).to.be.an('object');
          expect(result).to.contain.keys('abbr', 'name');
          expect(result.id).to.equal(1);
        });
      });
    });
  });

  describe ('create', () => {
    it ('should accept an Array of column names', () => {
      const fields = ['abbr', 'name'];
      const insertQuery = sql.create(tableName, fields);
      expect(insertQuery).to.be.a('string');
      expect(insertQuery).to.contain('$[abbr]');
      expect(insertQuery).to.contain('RETURNING *');
    });
    it ('should accept an object with columns and values', () => {
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const insertQuery = sql.create(tableName, data);
      expect(insertQuery).to.be.a('string');
      expect(insertQuery).to.contain('FICKLE');
      expect(insertQuery).to.contain('RETURNING *');
    });
    it ('should return a valid INSERT query', () => {
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
    var stateID;
    before (() => {
      const newState = {
        abbr: 'DO',
        name: 'DONGLE'
      };
      const createQuery = sql.create(tableName, newState);
      return db.one(createQuery).then(result => {
        stateID = result.id;
      });
    });
    it ('should accept an Array of column names', () => {
      const fields = ['abbr', 'name'];
      const updateQuery = sql.update(tableName, fields);
      expect(updateQuery).to.be.a('string');
      expect(updateQuery).to.contain('$[abbr]');
      expect(updateQuery).to.contain('RETURNING *');
    });
    it ('should accept an object with columns and values', () => {
      const data = { 'abbr' : 'FK', 'name' : 'FICKLE' };
      const updateQuery = sql.update(tableName, data);
      expect(updateQuery).to.be.a('string');
      expect(updateQuery).to.contain('FICKLE');
      expect(updateQuery).to.contain('$[id]');
      expect(updateQuery).to.contain('RETURNING *');
    });
    it ('should return a valid UPDATE query', () => {
      const data = { 'abbr' : 'FO', 'name' : 'FLOP' };
      const updateQuery = sql.update(tableName, data);
      return db.one(updateQuery, { id: stateID }).then(result => {
        expect(result).to.be.an('object').and.to.contain.keys([
          'abbr', 'name', 'id', 'created_at'
        ]);
        expect(result.id).to.equal(stateID);
        expect(result.name).to.equal('FLOP');
        expect(result.abbr).to.equal('FO');
      });
    });
  });

  describe('destroy', () => {
    var stateID;
    before (() => {
      const newState = {
        abbr: 'KP',
        name: 'KITCHENPATROL'
      };
      const createQuery = sql.create(tableName, newState);
      return db.one(createQuery).then(result => {
        stateID = result.id;
      });
    });
    it ('should return a paramaterized DELETE statement', () => {
      const deleteQuery = sql.destroy(tableName);
      expect(deleteQuery).to.be.a('string')
        .and.to.contain('$[id]');
    });
    it ('should be a valid DELETE query', () => {
      const deleteQuery = sql.destroy(tableName);
      return db.none(deleteQuery, {id : stateID }).then(result => {
        expect(result).to.equal(null);
      });
    });
  });

});
