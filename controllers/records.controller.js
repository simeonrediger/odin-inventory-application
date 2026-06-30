import { validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

export async function captureRawQuery(req, res, next) {
  res.locals.rawQuery = req.query;
  next();
}

export async function getRecords(req, res) {
  const { genreId, artistId } = matchedData(req);
  const validQuery =
    genreId === res.locals.rawQuery.genreId &&
    artistId === res.locals.rawQuery.artistId;
  const records = validQuery
    ? await db.records.findWithArtist({ genreId, artistId })
    : [];
  const genres = await db.genres.find();
  const artists = await db.artists.find();
  res.render('records', { pageName: 'Records', records, genres, artists });
}

export async function createRecord(req, res) {
  const record = matchedData(req);
  const errors = validationResult(req).array();

  if (errors.length !== 0) {
    res.status(400);
    res.locals.newEntryFields = record;
    res.locals.newEntryErrors = errors;
    return getRecords(req, res);
  }

  await db.records.create(record);
  res.redirect(req.body.returnTo);
}

export async function deleteRecord(req, res) {
  await db.records.deleteById(req.params.id);
  res.redirect(req.body.returnTo);
}
