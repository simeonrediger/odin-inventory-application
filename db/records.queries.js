import pool from './pool.js';

export async function findRecords() {
  const { rows } = await pool.query(
    `
    SELECT
      records.name,
      artists.id AS artist_id,
      artists.name AS artist_name,
      records.price,
      records.quantity
    FROM records
    INNER JOIN artists
      ON artists.id = records.artist_id
    ORDER BY records.name
    `,
  );

  return rows;
}

export async function deleteRecordById(id) {
  await pool.query(
    `
    DELETE FROM records
    WHERE records.id = $1
    `,
    [id],
  );
}
