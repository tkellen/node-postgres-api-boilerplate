const config = require('../../config');

module.exports = {
  client: {
    name: 'postgresql',
    config: config.db,
    "journalTable": "seeds_journal"
  },
  files: {
    directory: __dirname,
  },
};
