import { validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

export function preserveRawQuery(req, res, next) {
  res.locals.rawQuery = req.query;
  next();
}

export async function getRecords(req, res) {
  const { records, genres, artists } = await getPageData(req);
  res.render('records', { pageName: 'Records', records, genres, artists });
}

export async function createRecord(req, res) {
  const { artistId, name, price, quantity, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const record = { artistId, name, price, quantity };
  const errors = getErrorsFromLocation(req, { locations: ['body'] });

  if (errors.length !== 0) {
    const { records, genres, artists } = await getPageData(req);
    return res.status(400).render('records', {
      pageName: 'Records',
      records,
      genres,
      artists,
      createFields: record,
      createErrors: errors,
    });
  }

  await db.records.create(record);
  res.redirect(returnTo);
}

export async function deleteRecord(req, res) {
  const { returnTo } = matchedData(req, { locations: ['body'] });
  const errors = getErrorsFromLocation(req, { locations: ['body'] });

  if (errors.length !== 0) {
    const { records, genres, artists } = await getPageData(req);
    return res.status(400).render('records', {
      pageName: 'Records',
      records,
      genres,
      artists,
      deleteErrors: errors,
    });
  }

  await db.records.deleteById(req.params.id);
  res.redirect(returnTo);
}

async function getPageData(req) {
  const records = await searchRecords(req);
  const genres = await db.genres.find();
  const artists = await db.artists.find();
  return { records, genres, artists };
}

async function searchRecords(req) {
  const { genreId, artistId } = matchedData(req, { locations: ['query'] });
  const records = queryIsValid(req)
    ? await db.records.findWithArtist({ genreId, artistId })
    : [];
  return records;
}

function getErrorsFromLocation(req, { locations }) {
  return validationResult(req)
    .array()
    .filter(error => locations.includes(error.location))
    .map(error => error.msg);
}

function queryIsValid(req) {
  const errors = getErrorsFromLocation(req, { locations: ['query'] });
  return errors.length === 0;
}
