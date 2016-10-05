import {schema} from './model';

const requireId = {
  anyOf: [
    { type: 'integer' },
    {
      type: 'string',
      pattern: "^[0-9]+$"
    }
  ],
  required: true
};

export const create = {
  type: 'object',
  required: true,
  properties: {
    body: {
      type: 'object',
      required: true,
      properties: {
        data: {
          oneOf: [
            schema,
            {
              type: 'array',
              items: schema
            }
          ],
          required: true
        },
      },
    }
  }
};

export const readOne = {
  type: 'object',
  required: true,
  properties: {
    type: 'object',
    required: true,
    params: {
      properties: {
        id: requireId
      }
    }
  }
};

export const patch = {
  type: 'object',
  required: true,
  properties: {
    body: {
      type: 'object',
      required: true,
      properties: {
        data: schema
      }
    }
  }
};

export const destroy = {
  type: 'object',
  required: true,
  properties: {
    params: {
      type: 'object',
      required: true,
      properties: {
        id: requireId
      }
    }
  }
};
