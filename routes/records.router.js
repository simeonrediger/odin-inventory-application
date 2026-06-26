import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';

const recordsRouter = Router();

recordsRouter.get('/', recordsController.getRecords);
recordsRouter.delete('/:id/:slug/delete', recordsController.deleteRecord);

export default recordsRouter;
