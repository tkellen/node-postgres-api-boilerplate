import bluebird from 'bluebird';
import pgp from 'pg-promise';
import monitor from 'pg-monitor';

import config from '../../config';

const options = {
  promiseLib: bluebird
};

if (config.DEBUG_SQL) {
  monitor.attach(options);
  monitor.setTheme('matrix');
}

export default pgp(options);
