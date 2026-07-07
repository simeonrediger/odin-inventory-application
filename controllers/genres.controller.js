import db from '../db/queries.js';

export async function getGenres(req, res) {
  const genres = await db.genres.find();
  res.render('genres', { pageName: 'Genres', genres });
}
