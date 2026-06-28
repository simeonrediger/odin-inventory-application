import { validationResult, matchedData } from 'express-validator';
import db from '../db/queries.js';

export async function getRecords(req, res) {
  const query = matchedData(req);
  const { artistId } = query;
  const records = await db.records.findWithArtist({ artistId });
  const artists = await db.artists.find();
  res.render('records', { pageName: 'Records', records, artists, query });
}

export async function createRecord(req, res) {
  const errors = validationResult(req).array();

  if (errors.length !== 0) {
    res.status(400);
    res.locals.newEntryErrors = errors;
    return getRecords(req, res);
  }

  const record = matchedData(req);
  await db.records.create(record);
  res.redirect(req.body.returnTo);
}

export async function deleteRecord(req, res) {
  await db.records.deleteById(req.params.id);
  res.redirect(req.body.returnTo);
}
