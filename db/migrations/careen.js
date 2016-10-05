const config = require('../../config');

module.exports = {
  client: {
    name: 'postgresql',
    config: config.db,
    "journalTable": "schema_journal"
  },
  files: {
    directory: __dirname,
  },
};
