/* global describe, it, before */

import { expect } from 'chai';
import request from 'supertest-as-promised';
import { up } from '../helpers/migrate';
import fixtures from '../helpers/fixtures';

import app from '../../src/base/app';
import { location} from '../../src/endpoints/state/routes';

before(() => {
  up();
  return fixtures();
});

describe (`Endpoint ${location}`, () => {
  var firstID;

  before (() => {
    return request(app)
      .get(location)
      .then(res => {
        firstID = res.body.data[0].id;
        console.log(firstID);
      });
  });

  describe (`GET ${location}`, () => {
    it ('should return Array of resources', () => {
      return request(app)
        .get(location)
        .expect(200)
        .then(res => {
          expect(res).to.contain.key('body');
          expect(res.body).to.contain.key('data');
          expect(res.body.data).to.be.an('Array');
        });
    });
  });

  describe (`GET ${location}/:id`, () => {

    it ('should return a single resource', () => {
      return request(app)
        .get(`${location}/${firstID}`)
        .expect(200)
        .then(res => {
          expect(res.body).to.contain.key('data');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.contain.keys('name', 'abbr', 'id');
        });
    });

    describe(`GET ${location}/:id (invalid)`, () => {
      it ('should handle invalid request', () => {
        return request(app)
          .get(`${location}/futz`)
          .expect(500) // TODO review later
          .then(res => {
            expect(res).to.contain.key('error');
            expect(res.body).to.contain.key('errors');
            expect(res.body.errors).to.be.an('Array')
              .and.to.have.length(1);
            expect(res.body.errors[0]).to.be.an('object')
              .and.to.contain.keys('code', 'message');
            expect(res.serverError).to.be.true;
            expect(res.clientError).to.be.false;
          });
      });
      it ('should handle request for non-existent resource', () => {
        return request(app)
          .get(`${location}/10924899`)
          .expect(404);
      });
    });
  });

  describe ('POST ${location}', () => {
    const fakeState = {
      name: 'FAKE STATE',
      abbr: 'FS'
    };
    it ('should create a resource', () => {
      return request(app)
        .post(location)
        .send({
          data: fakeState
        })
        .expect(201)
        .then(res => {
          expect(res.headers).to.contain.key('location');
          expect(res.body.data).to.be.an('object')
            .and.to.contain.keys('name', 'abbr'); // TODO automate
        });
    });
    describe ('POST ${location} (invalid)', () => {
      it ('should handle request with empty body', () => {
        return request(app)
          .post(location)
          .send({})
          .expect(409);
      });
      it ('should handle request with uniqueness constraint violation');
      it ('should handle request with bad schema');
    });
  });

  describe(`POST ${location} (multiple)`, () => {
    const resources = [
      { name: 'IMAGINARY', abbr: 'IM' },
      { name: 'ILLUSORY', abbr: 'IS' }
    ];
    it ('should create multiple resources', () => {
      return request(app)
        .post(location)
        .send({ data: resources })
        .expect(201)
        .then(res => {
          expect(res.body.data).to.be.an('Array')
            .and.to.have.length(resources.length);
          expect(res.headers).not.to.contain.key('location');
        });
    });
  });

  describe(`PATCH ${location}/:id`, () => {
    var resourceID;
    before (() => {
      return request(app)
        .post(location)
        .send({ data: {
          name: 'FLUIDITY',
          abbr: 'FD'
        }})
        .then(res => {
          resourceID = res.body.data.id;
          return resourceID;
        });
    });

    it.skip ('it should patch resource', () => {
      return request(app)
        .patch(`${location}/${resourceID}`)
        .send({data : { name: 'FRAGILITY'}})
        .expect(200)
        .then(res => {
          console.log(res);
        });
    });
  });

  describe(`DELETE ${location}/:id`, () => {
    var resourceID;
    before (() => {
      return request(app)
        .post(location)
        .send({ data: {
          name: 'AMPHERE',
          abbr: 'AM'
        }})
        .then(res => {
          resourceID = res.body.data.id;
          return resourceID;
        });
    });

    it ('should delete a resource', () => {
      return request(app)
        .delete(`${location}/${resourceID}`)
        .expect(204)
        .then(res => {
          expect(res.body).to.be.empty;
        });
    });

    it ('should handle invalid delete requests');
  });
});
