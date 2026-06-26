import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';
import { validateReturnUrl } from '../validators/validation.js';

const recordsRouter = Router();

recordsRouter.get('/', recordsController.getRecords);
recordsRouter.delete(
  '/:id/:slug',
  validateReturnUrl,
  recordsController.deleteRecord,
);

export default recordsRouter;
