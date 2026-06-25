import { Router } from 'express';
import * as artistsController from '../controllers/artists.controller.js';

const artistsRouter = Router();

artistsRouter.get('/', artistsController.getArtists);
artistsRouter.get('/:id/:slug', artistsController.getArtistRecords);
artistsRouter.post(
  '/:id/:slug/records/:recordId/delete',
  artistsController.deleteArtistRecord,
);

export default artistsRouter;
