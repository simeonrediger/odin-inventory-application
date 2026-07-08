import { matchedData, validationResult } from 'express-validator';
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
  res.redirect(303, returnTo);
}

export async function updateRecord(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { artistId, name, price, quantity, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const record = { id, artistId, name, price, quantity };
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const { records, genres, artists } = await getPageData(req);
    return res.status(400).render('records', {
      pageName: 'Records',
      records,
      genres,
      artists,
      updateFields: record,
      updateErrors: errors,
    });
  }

  await db.records.updateById(id, record);
  res.redirect(303, returnTo);
}

export async function deleteRecord(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const fields = matchedData(req, { locations: ['body'] });
  const { returnTo } = fields;
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const { records, genres, artists } = await getPageData(req);
    return res.status(400).render('records', {
      pageName: 'Records',
      records,
      genres,
      artists,
      deleteFields: fields,
      deleteErrors: errors,
    });
  }

  await db.records.deleteById(id);
  res.redirect(303, returnTo);
}

async function getPageData(req) {
  const records = await searchRecords(req);
  const genres = await db.genres.find();
  const artists = await db.artists.find();
  return { records, genres, artists };
}

async function searchRecords(req) {
  const { genreId, artistId, name } = matchedData(req, {
    locations: ['query'],
  });
  const records = queryIsValid(req)
    ? await db.records.find({
        genreId,
        artistId,
        name,
        matchNameSubstring: true,
        includeArtist: true,
      })
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
