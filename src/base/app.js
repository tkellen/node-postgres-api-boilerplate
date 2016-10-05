import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import debug from 'debug';
import routeBuilder from 'express-routebuilder';

import endpoints from '../endpoints';

import { SHOW_ERRORS } from '../../config';

const debugRouteBuilder = debug('routeBuilder');

export default express()
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(morgan('combined'))
  .use(endpoints.map(endpoint => {
    debugRouteBuilder(`Loading routes for endpoint: ${endpoint.location}`);
    return routeBuilder(
      express.Router(),
      endpoint.routes,
      endpoint.location
    );
  }))
  .use(function(req, res, next) {
    res.status(404).send('404 Not Found');
  })
  .use(function(err, req, res, next) {
    res.status(500);
    if (!(err instanceof Error)) {
      return res.send(err);
    }
    if (SHOW_ERRORS) {
      return res.send(Object.getOwnPropertyNames(err).reduce((result, key) => {
        return Object.assign(result, {
          [key]: err[key]
        });
      }, {}));
    }
    res.send('Internal Error');
  });
