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

export async function findArtistById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM artists
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
}

export async function findRecordsByArtistId(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM records
    WHERE records.artist_id = $1
    ORDER BY records.name
    `,
    [id],
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
