import pool from './pool.js';

export async function findWithArtist() {
  const { rows } = await pool.query(
    `
    SELECT
      artists.id AS artist_id,
      artists.name AS artist_name,
      records.name,
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

export async function findByArtistId(artistId) {
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

export async function create({ artistId, name, price, quantity }) {
  await pool.query(
    `
    INSERT INTO records
      (artist_id, name, price, quantity)
    VALUES
      ($1, $2, $3, $4)
    `,
    [artistId, name, price, quantity],
  );
}

export async function deleteById(id) {
  await pool.query(
    `
    DELETE FROM records
    WHERE records.id = $1
    `,
    [id],
  );
}
