import pool from './pool.js';

export async function find() {
  const { rows } = await pool.query(
    `
    SELECT * FROM artists
    ORDER BY name
    `,
  );

  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM artists
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
}

export async function findByGenreId(genreId) {
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
