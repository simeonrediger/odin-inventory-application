import db from '../db/queries.js';

export async function getArtists(req, res) {
  const artists = await db.artists.find();
  res.render('artists', { pageName: 'Artists', artists });
}
