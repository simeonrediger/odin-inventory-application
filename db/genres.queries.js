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
