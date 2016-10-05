import validator from 'is-my-json-valid';

import {table, queries, location, fields} from './model';

import db from '../../services/db';

import * as baseSql from '../../base/sql';
import {error, success} from '../../base/handler';

export function create (req, res) {
  // determine if we are creating a single record or multiple records
  const single = !Array.isArray(req.body.data);
  // normalize to always attempting multiple records
  const data = single ? [req.body.data] : req.body.data;
  // create a transaction to do multiple creates in.
  // todo: lose the transaction and incorporate
  // https://github.com/vitaly-t/pg-promise/wiki/Performance-Boost
  db.tx(t => {
    return t.batch(data.map(insert => {
      // generate insert statements for each item to be created
      const fields = Object.keys(insert);
      const sql = baseSql.create(table, fields);
      return db.one(sql, insert);
    }));
  }).then(result => {
    // send the right status code for creation
    res.status(201);
    // if we have created a single item, we can send a location header
    // indicating where the new resource can be accessed
    if (single) {
      result = result[0];
      res.location(`${location}/${result.id}`);
    }
    // send the created data back
    res.send(success(result));
  }).catch(e => {
    if (e.code) {
      res.status(500).send(error(e));
    } else {
      res.status(409).send(error(e.map(err=>err.result)));
    }
  });
};

export function read (req, res) {
  // determine if we expect a single item or multiple items
  // based on the presence or absence of an id param
  const single = !!req.params.id;
  // use the right query for the job
  // TOOD: consider adding a baseSql function for read queries.
  // right now it has been omitted under the assumption that
  // it is desirable to have the flexibility of using arbitrary
  // queries for reads
  const query = single ? queries.read_by_id : queries.read_many;
  // find the data we're looking for
  db.query(query, req.params).then(result => {
    // if we were looking for a single item but it wasn't there, that is a 404
    if (single && result.length === 0) {
      res.status(404).send('404 Not Found');
    } else {
      // return the results as an object for single lookup and array for many
      res.status(200).send(success(single ? result[0] : result));
    }
  }).catch(e => {
    if (e.code) {
      res.status(500);
    } else {
      res.status(409);
    }
    res.send(error(e));
  });
}

export function update (req, res) {
  // generate an update query
  const query = baseSql.update(table, Object.keys(req.body.data));
  // right now we assume we will always be updating by id and
  // simply include the id in the context object passed to the query
  const data = Object.assign({
    id: req.params.id
  }, req.body.data);
  // TODO: this should 404 on non-existent resources
  // update the record we have specified
  db.one(query, data).then(result => {
    // send the updated data back to the user
    res.status(200).send(success(result));
  }).catch(e => {
    if (e.code) {
      res.status(500);
    } else {
      res.status(409);
    }
    res.send(error(e));
  });
}

export function destroy (req, res) {
  // generate a delete query
  const query = baseSql.destroy(table);
  // get rid of the entry we specified
  db.none(query, req.params).then(result => {
    // send the right status code for a response with no body
    res.status(204).end();
  }).catch(e => {
    if (e.code) {
      res.status(500);
    } else {
      res.status(409);
    }
    res.send(error(e));
  });
}

// helper function for validating requests using json-schema
export function valid (schema) {
  return function (req, res, next) {
    const validate = validator(schema);
    if (validate(req)) {
      next();
    } else {
      res.status(409).send({
        errors: validate.errors
      });
    }
  }
}
