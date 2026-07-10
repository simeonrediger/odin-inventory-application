import { Router } from 'express';
import * as genresController from '../controllers/genres.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import { validateQuery } from '../validators/genre.validation.js';

const genresRouter = Router();

genresRouter.get(
  '/',
  preserveRawQuery,
  validateQuery,
  genresController.getGenres,
);

export default genresRouter;
