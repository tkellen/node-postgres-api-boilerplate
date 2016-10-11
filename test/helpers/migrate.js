// careen doesn't expose an API, so...
import { execSync as exec } from 'child_process';
import path from 'path';
const configPath = path.resolve(__dirname, '../../db/migrations', 'careen.js');

const migrator = path.resolve(
  __dirname,
  '../..',
  'node_modules',
  '.bin',
  'careen'
);

/**
 * Execute the migration with the given <command>
 * -c <configPath> to tell careen where config is
 *
 * @param {String} command
 */
function execute (command) {
  exec(migrator + ' -c "' + configPath + '" ' + command);
}

/**
 * Bound function that will invoke migrator with
 * -A apply all migration(s)
 * -e apply transactionally
 */
export const up = execute.bind(null, '-A -e');

/**
 * Take DB back, migrate down
 * -R revert migrations (down)
 * (TODO: -e and -a in the same command?)
 * TODO: How to derive ID of first migration?
 */
export const reset = function () {
  execute('-R -a -e -n 10000');
  execute('-A -e');
};
