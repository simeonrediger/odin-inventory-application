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

export async function findRecordsByArtistId(artistId) {
  const { rows } = await pool.query(
    `
    SELECT * FROM records
    WHERE artist_id = $1
    ORDER BY name
    `,
    [artistId],
  );

  return rows;
}

export async function createRecord({ name, artistId, price, quantity }) {
  await pool.query(
    `
    INSERT INTO records
      (name, artist_id, price, quantity)
    VALUES
      ($1, $2, $3, $4)
    `,
    [name, artistId, price, quantity],
  );
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
