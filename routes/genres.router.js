import { Router } from 'express';
import * as genresController from '../controllers/genres.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import { validateReturnUrl } from '../validators/validation.js';

import {
  validateQuery,
  validateGenre,
} from '../validators/genre.validation.js';

const genresRouter = Router();

genresRouter
  .route('/')
  .get(preserveRawQuery, validateQuery, genresController.getGenres)
  .post(
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
    validateGenre,
    genresController.createGenre,
  );

export default genresRouter;
