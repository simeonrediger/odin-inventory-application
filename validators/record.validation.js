import { body, query, validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

export const validateQuery = [
  query('genreId').optional().isInt({ min: 1 }),
  query('artistId').optional().isInt({ min: 1 }),
];

export const validateReturnUrlQuery = [
  validateReturnUrlQueryParam('genreId'),
  validateReturnUrlQueryParam('artistId'),
];

function validateReturnUrlQueryParam(param) {
  return query(param).customSanitizer((value, { req }) =>
    getReturnUrlQueryParam(value, { req, param }),
  );
}

function getReturnUrlQueryParam(value, { req, param }) {
  const { returnTo } = matchedData(req);
  return new URL('https://example.invalid' + returnTo).searchParams.get(param);
}

export const validateRecord = [
  body('artistId')
    .trim()
    .notEmpty()
    .withMessage('Artist is required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('Artist ID must be a positive integer')
    .bail()
    .custom(artistIdExists),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Record name is required')
    .if(fieldIsValid('artistId'))
    .custom(recordNameIsUnique),
  body('price')
    .trim()
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('Price must not exceed two decimal places')
    .customSanitizer(dollarsToCents),
  body('quantity')
    .trim()
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

async function artistIdExists(artistId) {
  const artist = await db.artists.findById(artistId);

  if (!artist) {
    throw new Error(`Artist ID does not exist: ${artistId}`);
  }
}

function fieldIsValid(field) {
  return (value, { req }) => {
    const { errors } = validationResult(req);
    return !errors?.some(error => error.path === field);
  };
}

async function recordNameIsUnique(name, { req }) {
  const { artistId } = matchedData(req);
  const records = await db.records.find({ name, artistId });

  if (records.length > 0) {
    throw new Error(`Record name already exists: ${name}`);
  }
}

function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}
