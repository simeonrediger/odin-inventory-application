import db from '../db/queries.js';

export async function getGenres(req, res) {
  const genres = await db.genres.find({ includeArtists: true });
  res.render('genres', { pageName: 'Genres', genres });
}
