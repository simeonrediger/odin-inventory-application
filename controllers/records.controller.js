import * as db from '../db/records.queries.js';

export async function getRecords(req, res) {
  const records = await db.findRecords();
  res.render('records', { pageName: 'Records', records });
}

export async function createRecord(req, res) {
  const { name, artistId, price, quantity } = req.body;
  await db.createRecord({ name, artistId, price, quantity });
  res.redirect(req.body.returnTo);
}

export async function deleteRecord(req, res) {
  await db.deleteRecordById(req.params.id);
  res.redirect(req.body.returnTo);
}
