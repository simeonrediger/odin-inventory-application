import { body } from 'express-validator';

export const validateReturnUrl = [body('returnTo').custom(isRootRelative)];

function isRootRelative(url) {
  try {
    new URL(url);
  } catch (error) {
    if (url.startsWith('/')) {
      return true;
    }
  }

  throw new TypeError(`Return URL must be root-relative. Got "${url}"`);
}
