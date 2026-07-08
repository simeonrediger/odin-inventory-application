import { Router } from 'express';
import * as artistsController from '../controllers/artists.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import { validateQuery } from '../validators/artist.validation.js';

const artistsRouter = Router();

artistsRouter.get(
  '/',
  preserveRawQuery,
  validateQuery,
  artistsController.getArtists,
);

export default artistsRouter;
