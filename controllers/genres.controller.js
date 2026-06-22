import * as db from '../db/genres.queries.js';

export async function getGenres(req, res) {
  const genres = await db.findGenres();
  res.render('genres', { pageName: 'Genres', genres });
}
