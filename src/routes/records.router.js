import { Router } from 'express';
import * as recordsController from '../controllers/records.controller.js';

import preserveRawQuery from '../middleware/preserve-raw-query.js';

import {
  validateAdminPassword,
  validateReturnUrl,
} from '../validators/validation.js';

import {
  validateParams,
  validateQuery,
  validateRecord,
  validateNameToDelete,
} from '../validators/records.validation.js';

const recordsRouter = Router();

recordsRouter
  .route('/')
  .get(preserveRawQuery, validateQuery, recordsController.getRecords)
  .post(
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
    validateRecord,
    recordsController.createRecord,
  );

recordsRouter
  .route('/:id')
  .all(
    validateAdminPassword,
    validateParams,
    validateReturnUrl,
    preserveRawQuery,
    validateQuery,
  )
  .put(validateRecord, recordsController.updateRecord)
  .delete(validateNameToDelete, recordsController.deleteRecord);

export default recordsRouter;
