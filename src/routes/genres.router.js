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
  validateNameToDelete,
} from '../validators/genres.validation.js';

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

genresRouter
  .route('/:id')
  .all(
    validateAdminPassword,
    validateParams,
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
  )
  .put(validateGenre, genresController.updateGenre)
  .delete(validateNameToDelete, genresController.deleteGenre);

export default genresRouter;
