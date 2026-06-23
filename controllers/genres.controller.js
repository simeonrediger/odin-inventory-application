import * as db from '../db/genres.queries.js';

export async function getGenres(req, res) {
  const genres = await db.findGenres();
  res.render('genres', { pageName: 'Genres', genres });
}

export async function getGenreArtists(req, res) {
  const { id } = req.params;
  const genre = await db.findGenreById(id);
  const artists = await db.findArtistsByGenreId(id);
  res.render('genre-artists', { pageName: genre.name, genre, artists });
}
