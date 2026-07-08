import { validationResult } from 'express-validator';

export function getErrorsFromLocation(req, { locations }) {
  return validationResult(req)
    .array()
    .filter(error => locations.includes(error.location))
    .map(error => error.msg);
}

export function queryIsValid(req) {
  const errors = getErrorsFromLocation(req, { locations: ['query'] });
  return errors.length === 0;
}
