import { query, body, matchedData } from 'express-validator';
import { MAX_GENRE_NAME_LENGTH } from '../domains/constants.js';
import db from '../db/queries.js';

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
