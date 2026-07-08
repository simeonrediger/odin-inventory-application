import { query } from 'express-validator';

export const validateQuery = [
  query('genreId').optional().isInt({ min: 1 }),
  query('name').optional().notEmpty(),
  query('recordName').optional().notEmpty(),
];
