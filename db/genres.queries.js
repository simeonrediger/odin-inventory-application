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

export async function findNonExistentIds(ids) {
  const { rows } = await pool.query(
    `
    SELECT genre_ids.id
    FROM unnest($1::int[]) AS genre_ids(id)
    LEFT JOIN genres
      ON genres.id = genre_ids.id
    WHERE genres.id IS NULL
    `,
    [ids],
  );

  const nonExistentIds = rows.map(row => row.id);
  return nonExistentIds;
}
