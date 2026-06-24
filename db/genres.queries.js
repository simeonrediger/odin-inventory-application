import pool from './pool.js';

export async function findGenres() {
  const { rows } = await pool.query(
    `
    SELECT * FROM genres
    ORDER BY name
    `,
  );
  return rows;
}

export async function findGenreById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM genres
    WHERE id = $1
    `,
    [id],
  );
  return rows[0];
}

export async function findArtistsByGenreId(genreId) {
  const { rows } = await pool.query(
    `
    SELECT artists.*
    FROM artists
    INNER JOIN genre_artists
      ON artists.id = genre_artists.artist_id
    WHERE genre_artists.genre_id = $1
    ORDER BY artists.name
    `,
    [genreId],
  );

  return rows;
}
