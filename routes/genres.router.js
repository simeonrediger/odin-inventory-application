import { Router } from 'express';
import * as genresController from '../controllers/genres.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import {
  validateAdminPassword,
  validateReturnUrl,
} from '../validators/validation.js';

import {
  validateParams,
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

genresRouter.put(
  '/:id',
  validateAdminPassword,
  validateParams,
  validateReturnUrl,
  preserveRawQuery,
  validateQuery,
  validateGenre,
  genresController.updateGenre,
);

export default genresRouter;
