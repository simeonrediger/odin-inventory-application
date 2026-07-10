import { param, query, body, matchedData } from 'express-validator';
import { MAX_ARTIST_NAME_LENGTH } from '../domains/constants.js';
import db from '../db/queries.js';
import { genreIdsExist } from './genres.validation.js';

export const validateParams = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Artist ID must be a positive integer')
    .custom(artistIdExists),
];

export const validateQuery = [
  query('genreId').optional().isInt({ min: 1 }),
  query('name').optional().notEmpty(),
  query('recordName').optional().notEmpty(),
];

export const validateArtist = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Artist name is required')
    .isLength({ max: MAX_ARTIST_NAME_LENGTH })
    .withMessage(
      `Artist name must not exceed ${MAX_ARTIST_NAME_LENGTH} characters`,
    )
    .bail()
    .custom(nameIsUnique),
  body('genreIds').toArray().custom(allIntegers).bail().custom(genreIdsExist),
];

export const validateNameToDelete = [body('name').trim()];

export async function artistIdExists(id) {
  const artist = await db.artists.findById(id);

  if (!artist) {
    throw new Error(`Artist ID does not exist: ${id}`);
  }
}

async function nameIsUnique(name, { req }) {
  const artists = await db.artists.find({ name });

  if (req.method === 'PUT' && artists.length === 1) {
    const { id } = matchedData(req, { locations: ['params'] });
    const isSameArtist = artists[0].id == id;

    if (isSameArtist) {
      return true;
    }
  }

  const nameIsUnique = artists.length === 0;

  if (!nameIsUnique) {
    const artist = artists[0];
    throw new Error(`Artist with the name "${artist.name}" already exists`);
  }
}

function allIntegers(array) {
  const nonIntegers = [];

  array.forEach(value => {
    if (!isInteger(value)) {
      nonIntegers.push(value);
    }
  });

  if (nonIntegers.length > 0) {
    throw new TypeError(
      `Expected all integers. Found ${nonIntegers.join(', ')}`,
    );
  }

  return true;
}

function isInteger(value) {
  return /^\d+$/.test(value);
}
