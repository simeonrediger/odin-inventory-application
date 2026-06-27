import pool from './pool.js';

export async function find() {
  const { rows } = await pool.query(
    `
    SELECT * FROM genres
    ORDER BY name
    `,
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM genres
    WHERE id = $1
    `,
    [id],
  );
  return rows[0];
}
