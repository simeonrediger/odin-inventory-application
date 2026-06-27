import db from '../db/queries.js';

export async function getArtists(req, res) {
  const artists = await db.artists.find();
  res.render('artists', { pageName: 'Artists', artists });
}

export async function getArtistRecords(req, res) {
  const { id } = req.params;
  const artist = await db.artists.findByIdWithRecords(id);
  res.render('artist-records', { pageName: artist.name, artist });
}
