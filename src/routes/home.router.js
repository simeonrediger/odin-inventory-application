import { Router } from 'express';
import * as homeController from '../controllers/home.controller.js';

const homeRouter = Router();

homeRouter.get('/', homeController.getHome);

export default homeRouter;
