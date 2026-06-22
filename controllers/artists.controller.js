import * as db from '../db/artists.queries.js';

export async function getArtists(req, res) {
  const artists = await db.findArtists();
  res.render('artists', { pageName: 'Artists', artists });
}
