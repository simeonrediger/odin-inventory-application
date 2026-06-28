import db from '../db/queries.js';

export async function getRecords(req, res) {
  const { artistId } = req.query;
  const records = await db.records.findWithArtist({ artistId });
  const artists = await db.artists.find();
  res.render('records', { pageName: 'Records', records, artists });
}

export async function createRecord(req, res) {
  const { artistId, name, price, quantity } = req.body;
  await db.records.create({ artistId, name, price, quantity });
  res.redirect(req.body.returnTo);
}

export async function deleteRecord(req, res) {
  await db.records.deleteById(req.params.id);
  res.redirect(req.body.returnTo);
}
