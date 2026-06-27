import db from '../db/queries.js';

export async function getGenres(req, res) {
  const genres = await db.genres.findGenres();
  res.render('genres', { pageName: 'Genres', genres });
}

export async function getGenreArtists(req, res) {
  const { id } = req.params;
  const genre = await db.genres.findGenreById(id);
  const artists = await db.genres.findArtistsByGenreId(id);
  res.render('genre-artists', { pageName: genre.name, genre, artists });
}
