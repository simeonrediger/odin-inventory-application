import { Router } from 'express';
import * as genresController from '../controllers/genres.controller.js';

const genresRouter = Router();

genresRouter.get('/', genresController.getGenres);
genresRouter.get('/:id/:slug', genresController.getGenreArtists);

export default genresRouter;
