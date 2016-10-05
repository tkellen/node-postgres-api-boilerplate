import * as controller from './controller';
import * as model from './model';
import * as validations from './validations';

export const location = model.location;
export const routes = {
  post: {
    '/': [
      controller.valid(validations.create),
      controller.create
    ]
  },
  get: {
    '/': controller.read,
    '/:id': controller.read
  },
  patch: {
    '/:id': [
      controller.valid(validations.patch),
      controller.update
    ]
  },
  delete: {
    '/:id': [
      controller.valid(validations.destroy),
      controller.destroy
    ]
  },
};
