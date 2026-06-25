import * as db from '../db/artists.queries.js';

export async function getArtists(req, res) {
  const artists = await db.findArtists();
  res.render('artists', { pageName: 'Artists', artists });
}

export async function getArtistRecords(req, res) {
  const { id } = req.params;
  const artist = await db.findArtistById(id);
  const records = await db.findRecordsByArtistId(id);
  res.render('artist-records', { pageName: artist.name, artist, records });
}

export async function deleteArtistRecord(req, res) {
  const { id, slug, recordId } = req.params;
  await db.deleteRecordById(recordId);
  res.redirect(`/artists/${id}/${slug}`);
}
