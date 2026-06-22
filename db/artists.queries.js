import pool from './pool.js';

export async function findArtists() {
  const { rows } = await pool.query(
    `
    SELECT * FROM artists
    ORDER BY name
    `,
  );

  return rows;
}
