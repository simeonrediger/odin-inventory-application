import pool from './pool.js';

export async function find({ name, artistId } = {}) {
  const parameters = [];
  const filters = [];
  let sql = 'SELECT * FROM records';

  if (name !== undefined) {
    parameters.push(name);
    filters.push(`name ILIKE $${parameters.length}`);
  }

  if (artistId !== undefined) {
    parameters.push(artistId);
    filters.push(`artist_id = $${parameters.length}`);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  const { rows } = await pool.query(sql, parameters);
  return rows;
}

export async function findWithArtist({ artistId } = {}) {
  const parameters = [];
  let sql = `
    SELECT
      to_jsonb(artists) AS artist,
      records.id,
      records.name,
      records.price,
      records.quantity
    FROM records
    INNER JOIN artists
      ON artists.id = records.artist_id
  `;

  if (artistId !== undefined) {
    parameters.push(artistId);
    sql += 'WHERE artists.id = $1';
  }

  sql += ' ORDER BY records.name';

  const { rows } = await pool.query(sql, parameters);
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
  const parameters = [artistId, name, price];

  if (quantity !== undefined) {
    parameters.push(quantity);
  }

  await pool.query(
    `
    INSERT INTO records
      (artist_id, name, price${quantity === undefined ? ')' : ', quantity)'}
    VALUES
      ($1, $2, $3${quantity === undefined ? ')' : ', $4)'}
    `,
    parameters,
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
