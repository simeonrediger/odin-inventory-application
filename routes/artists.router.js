import { Router } from 'express';
import * as artistsController from '../controllers/artists.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import {
  validateAdminPassword,
  validateReturnUrl,
} from '../validators/validation.js';

import {
  validateParams,
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

artistsRouter.put(
  '/:id',
  validateAdminPassword,
  validateParams,
  validateReturnUrl,
  preserveRawQuery,
  validateQuery,
  validateArtist,
  artistsController.updateArtist,
);

export default artistsRouter;
