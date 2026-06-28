import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';
import { validateReturnUrl } from '../validators/validation.js';
import {
  validateQuery,
  validateRecord,
} from '../validators/record.validation.js';

const recordsRouter = Router();

recordsRouter
  .route('/')
  .get(validateQuery, recordsController.getRecords)
  .post(validateReturnUrl, validateRecord, recordsController.createRecord);
recordsRouter.delete(
  '/:id/:slug',
  validateReturnUrl,
  recordsController.deleteRecord,
);

export default recordsRouter;
