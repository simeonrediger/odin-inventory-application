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
  validateNameToDelete,
} from '../validators/artists.validation.js';

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

artistsRouter
  .route('/:id')
  .all(
    validateAdminPassword,
    validateParams,
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
  )
  .put(validateArtist, artistsController.updateArtist)
  .delete(validateNameToDelete, artistsController.deleteArtist);

export default artistsRouter;
