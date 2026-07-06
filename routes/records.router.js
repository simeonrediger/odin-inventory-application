import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';
import {
  validateAdminPassword,
  validateReturnUrl,
} from '../validators/validation.js';
import {
  validateParams,
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

recordsRouter
  .route('/:id/:slug')
  .all(
    validateAdminPassword,
    validateParams,
    validateReturnUrl,
    recordsController.preserveRawQuery,
    validateQuery,
  )
  .put(validateRecord, recordsController.updateRecord)
  .delete(recordsController.deleteRecord);

export default recordsRouter;
