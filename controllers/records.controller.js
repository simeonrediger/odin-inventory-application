import { validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

export function preserveRawQuery(req, res, next) {
  assignRawQueryToLocals(res, req.query);
  next();
}

export function preserveRawReturnUrlQuery(req, res, next) {
  const returnUrlQuery = matchedData(req, { locations: ['query'] });
  assignRawQueryToLocals(res, returnUrlQuery);
  next();
}

export async function getRecords(req, res) {
  const { genreId, artistId } = matchedData(req);
  const records = queryIsValid(req)
    ? await db.records.findWithArtist({ genreId, artistId })
    : [];
  const genres = await db.genres.find();
  const artists = await db.artists.find();
  res.render('records', { pageName: 'Records', records, genres, artists });
}

export async function createRecord(req, res) {
  const { artistId, name, price, quantity, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const record = { artistId, name, price, quantity };
  const errors = validationErrors(req, { locations: ['body'] });

  if (errors.length !== 0) {
    res.status(400);
    res.locals.newEntryFields = record;
    res.locals.newEntryErrors = errors;

    const { genreId, artistId } = matchedData(req, { locations: ['query'] });
    const records = queryIsValid(req)
      ? await db.records.findWithArtist({ genreId, artistId })
      : [];
    const genres = await db.genres.find();
    const artists = await db.artists.find();
    return res.render('records', {
      pageName: 'Records',
      records,
      genres,
      artists,
    });
  }

  await db.records.create(record);
  res.redirect(returnTo);
}

export async function deleteRecord(req, res) {
  const { returnTo } = matchedData(req);
  await db.records.deleteById(req.params.id);
  res.redirect(returnTo);
}

function assignRawQueryToLocals(res, rawQuery) {
  res.locals.rawQuery = rawQuery;
}

function validationErrors(req, { locations }) {
  return validationResult(req)
    .errors.filter(error => locations.includes(error.location))
    .map(error => error.msg);
}

function queryIsValid(req) {
  const errors = validationErrors(req, { locations: ['query'] });
  return errors.length === 0;
}
