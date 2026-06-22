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
