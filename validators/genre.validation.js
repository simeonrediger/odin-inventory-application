import { query } from 'express-validator';

export const validateQuery = [
  query('name').optional().notEmpty(),
  query('artistName').optional().notEmpty(),
];
