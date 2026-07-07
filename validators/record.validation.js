import {
  param,
  query,
  body,
  validationResult,
  matchedData,
} from 'express-validator';
import db from '../db/queries.js';

export const validateParams = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Record ID must be a positive integer')
    .custom(recordIdExists),
];

export const validateQuery = [
  query('genreId').optional().isInt({ min: 1 }),
  query('artistId').optional().isInt({ min: 1 }),
  query('name').optional().notEmpty(),
];

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
    .custom(nameIsUnique),
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

export const validateName = [body('name').trim()];

async function recordIdExists(id) {
  const record = await db.records.findById(id);

  if (!record) {
    throw new Error(`Record ID does not exist: ${id}`);
  }
}

async function artistIdExists(artistId) {
  const artist = await db.artists.findById(artistId);

  if (!artist) {
    throw new Error(`Artist ID does not exist: ${artistId}`);
  }
}

function fieldIsValid(field) {
  return (value, { req }) => !validationResult(req).mapped()[field];
}

async function nameIsUnique(name, { req }) {
  const { artistId } = matchedData(req, { locations: ['body'] });
  const records = await db.records.find({
    artistId,
    name,
    includeArtist: true,
  });

  if (req.method === 'PUT' && records.length === 1) {
    const isSameRecord = records[0].id == req.params.id;

    if (isSameRecord) {
      return true;
    }
  }

  const nameIsUnique = records.length === 0;

  if (!nameIsUnique) {
    const { name, artist } = records[0];
    throw new Error(`${artist.name} record name already exists: "${name}"`);
  }
}

function dollarsToCents(dollars) {
  return Math.round(dollars * 100);
}
