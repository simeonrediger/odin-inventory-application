import * as db from '../db/artists.queries.js';

export function getArtists(req, res) {
  const artists = db.findArtists();
  res.render('artists', { pageName: 'Artists', artists });
}
