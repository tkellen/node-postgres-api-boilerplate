import path from 'path';
import {load} from '../../base/sql';

export const table = 'state';
export const fields = ['name'];
export const location = '/v1/state';
export const queries = load(path.join(__dirname, './queries'));
export const schema = {
  type: 'object',
  required: true,
  properties: {
    id: {
      anyOf: [
        { type: 'integer' },
        {
          type: 'string',
          pattern: "^[0-9]+$"
        }
      ]
    },
    name: {
      type: 'string',
      required: true
    },
    abbr: {
      type: 'string',
      required: true
    }
  }
};
