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
  .get(
    recordsController.preserveRawQuery,
    validateQuery,
    recordsController.getRecords,
  )
  .post(
    validateReturnUrl,
    recordsController.preserveRawQuery,
    validateQuery,
    validateRecord,
    recordsController.createRecord,
  );
recordsRouter.delete(
  '/:id/:slug',
  validateReturnUrl,
  recordsController.preserveRawQuery,
  validateQuery,
  recordsController.deleteRecord,
);

export default recordsRouter;
