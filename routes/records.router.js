import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';
import { validateReturnUrl } from '../validators/validation.js';
import {
  validateQuery,
  validateReturnUrlQuery,
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
    validateReturnUrlQuery,
    recordsController.preserveRawReturnUrlQuery,
    validateQuery,
    validateRecord,
    recordsController.createRecord,
  );
recordsRouter.delete(
  '/:id/:slug',
  validateReturnUrl,
  recordsController.deleteRecord,
);

export default recordsRouter;
