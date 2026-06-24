import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';

const recordsRouter = Router();

recordsRouter.get('/', recordsController.getRecords);

export default recordsRouter;
