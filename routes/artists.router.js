import { Router } from 'express';
import * as artistsController from '../controllers/artists.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import { validateReturnUrl } from '../validators/validation.js';

import {
  validateQuery,
  validateArtist,
} from '../validators/artist.validation.js';

const artistsRouter = Router();

artistsRouter
  .route('/')
  .get(preserveRawQuery, validateQuery, artistsController.getArtists)
  .post(
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
    validateArtist,
    artistsController.createArtist,
  );

export default artistsRouter;
