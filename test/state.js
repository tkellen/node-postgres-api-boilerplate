import test from 'ava';
import request from 'supertest-as-promised';
import { up } from './helpers/migrate';
import fixtures from './helpers/fixtures';

import app from '../src/base/app';
import { location } from '../src/endpoints/state/routes';

test.before(t => {
  up();
  return fixtures();
});

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

test(`GET ${location}/:id (invalid)`, t => {
  const badIntRequest = request(app)
    .get(`${location}/futz`)
    .expect(500) // Hmmm, really?
    .then(res => {
      t.true(res.hasOwnProperty('error'));
      t.truthy(res.serverError); // this seems odd
      t.falsy(res.clientError); // as does this
    });
  const nonExistentRequest = request(app)
    .get(`${location}/1093498`)
    .expect(404);
  return Promise.all([badIntRequest, nonExistentRequest]);
});

test(`POST ${location} (single)`, t => {
  const fakeState = {
    name: 'FAKE STATE',
    abbr: 'FS'
  };
  return request(app)
    .post(location)
    .send({
      data: fakeState
    })
    .expect(201)
    .then(res => {
      t.truthy(res.headers.location);
      t.truthy(res.headers.location.match(`${location}\/[0-9]+`));
      Object.keys(fakeState).forEach(field => {
        t.is(res.body.data[field], fakeState[field]);
      });
    });
});

test(`POST ${location} (single, invalid)`, t => {
  const badStates = {
    emptyBody: {
      data: {},
      field: 'data.body.data' // ??? TODO later
    },
    missingName: {
      data: { abbr: 'FO' },
      field: 'data.body.data'
    },
    duplicateName: {
      data: { name: 'ALABAMA'},
      field: 'data.body.data' // This is buggy
    },
    invalidNameType: {
      data: { abbr: 'FO', name: 4 },
      field: 'data.body.data'
    }
  };
  t.plan(Object.keys(badStates).length * 7);
  const badRequests = [];
  Object.keys(badStates).forEach(variationOnBad => {
    badRequests.push(request(app)
      .post(location)
      .send({ data : badStates[variationOnBad].data })
      .expect(409)
      .then(res => {
        t.truthy(res.clientError);
        t.truthy(res.error);
        t.falsy(res.body.data);
        t.true(Array.isArray(res.body.errors));
        t.true(typeof res.body.errors[0] === 'object');
        t.is(res.body.errors[0].field, badStates[variationOnBad].field); // TODO review later
        t.truthy(res.body.errors[0].message);
      })
    );
  });
  return Promise.all(badRequests);
});

test.todo(`POST ${location} (multiple)`);
test.todo(`POST ${location} (multiple, invalid)`);
test.todo(`PATCH ${location}/:id`);
test.todo(`PATCH ${location}/:id (invalid)`);
test.todo(`DELETE ${location}/:id`);
test.todo(`DELETE ${location}/:id (invalid)`);
