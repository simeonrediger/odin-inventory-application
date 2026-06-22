import { Router } from 'express';
import * as artistsController from '../controllers/artists.controller.js';

const artistsRouter = Router();

artistsRouter.get('/', artistsController.getArtists);

export default artistsRouter;
