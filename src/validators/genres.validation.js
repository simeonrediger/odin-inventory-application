import { param, query, body, matchedData } from 'express-validator';
import { MAX_GENRE_NAME_LENGTH } from '../domains/constants.js';
import db from '../db/queries.js';

export const validateParams = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Genre ID must be a positive integer')
    .custom(genreIdExists),
];

export const validateQuery = [
  query('name').optional().notEmpty(),
  query('artistName').optional().notEmpty(),
];

export const validateGenre = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Genre name is required')
    .isLength({ max: MAX_GENRE_NAME_LENGTH })
    .withMessage(
      `Genre name must not exceed ${MAX_GENRE_NAME_LENGTH} characters`,
    )
    .bail()
    .custom(nameIsUnique),
];

export const validateNameToDelete = [body('name').trim()];

export async function genreIdExists(id) {
  const genre = await db.genres.findById(id);

  if (!genre) {
    throw new Error(`Genre ID does not exist: ${id}`);
  }
}

async function nameIsUnique(name, { req }) {
  const genres = await db.genres.find({ name });

  if (req.method === 'PUT' && genres.length === 1) {
    const { id } = matchedData(req, { locations: ['params'] });
    const isSameGenre = genres[0].id == id;

    if (isSameGenre) {
      return true;
    }
  }

  const nameIsUnique = genres.length === 0;

  if (!nameIsUnique) {
    const genre = genres[0];
    throw new Error(`Genre with the name "${genre.name}" already exists`);
  }
}

export async function genreIdsExist(genreIds, { req }) {
  const nonExistentGenreIds = await db.genres.findNonExistentIds(genreIds);

  if (nonExistentGenreIds.length > 0) {
    const message =
      nonExistentGenreIds.length === 1
        ? `Genre ID does not exist: ${nonExistentGenreIds[0]}`
        : `Genre IDs do not exist: ${nonExistentGenreIds.join(', ')}`;

    throw new Error(message);
  }
}
