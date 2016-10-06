import test from 'ava';
import request from 'supertest-as-promised';

import app from '../src/base/app';
import { location } from '../src/endpoints/state/routes';

test.todo('before hook handler');

test(`GET ${location}`, t => {
  return request(app)
    .get(location)
    .expect(200)
    .then(res => {
      t.true(res.hasOwnProperty('body'));
      t.true(res.body.hasOwnProperty('data'));
      t.true(Array.isArray(res.body.data));
    });
});

test(`GET ${location}/:id`, t => {
  return request(app)
    .get(location)
    .expect(200)
    .then(res => {
      const firstStateResource = res.body.data[0];
      return request(app)
        .get(`${location}/${firstStateResource.id}`)
        .expect(200)
        .then(res => {
          const stateResource = res.body.data;
          ['id', 'name', 'abbr'].forEach(field => {
            t.true(stateResource.hasOwnProperty(field));
            t.is(firstStateResource[field], stateResource[field]);
          });
        });
    });
});

test.todo(`GET ${location}/:id (invalid)`);
test.todo(`POST ${location} (single)`);
test.todo(`POST ${location} (single, invalid)`);
test.todo(`POST ${location} (multiple)`);
test.todo(`POST ${location} (multiple, invalid)`);
test.todo(`PATCH ${location}/:id`);
test.todo(`PATCH ${location}/:id (invalid)`);
test.todo(`DELETE ${location}/:id`);
test.todo(`DELETE ${location}/:id (invalid)`);
