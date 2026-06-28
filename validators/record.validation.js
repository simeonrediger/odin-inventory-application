import { body, validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

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
    .isNumeric({ min: 0 })
    .withMessage('Price must be a non-negative number'),
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
