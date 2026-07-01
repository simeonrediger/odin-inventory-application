import { body } from 'express-validator';

export const validateReturnUrl = [body('returnTo').custom(isRootRelative)];

function isRootRelative(value) {
  try {
    new URL(value);
  } catch (error) {
    if (value.startsWith('/')) {
      return true;
    }
  }

  throw new TypeError('Return URL must be root-relative');
}
