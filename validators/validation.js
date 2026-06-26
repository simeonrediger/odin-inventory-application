import { body } from 'express-validator';

export const validateReturnUrl = [
  body('returnTo').customSanitizer(absoluteUrlToRoot),
];

function absoluteUrlToRoot(url) {
  try {
    new URL(url);
    return '/';
  } catch (error) {
    return url;
  }
}
