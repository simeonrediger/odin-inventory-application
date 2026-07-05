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

export async function findWithArtist({ genreId, artistId } = {}) {
  const parameters = [];
  const filters = [];
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

  if (genreId !== undefined) {
    parameters.push(genreId);
    sql += `
      INNER JOIN genre_artists
        ON genre_artists.artist_id = artists.id
    `;
    filters.push(`genre_artists.genre_id = $${parameters.length}`);
  }

  if (artistId !== undefined) {
    parameters.push(artistId);
    filters.push(`artists.id = $${parameters.length}`);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  sql += ' ORDER BY records.name, artists.name';

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

export async function updateById({ id, artistId, name, price, quantity }) {
  await pool.query(
    `
    UPDATE records SET
      artist_id = $2,
      name = $3,
      price = $4,
      quantity = $5
    WHERE id = $1
    `,
    [id, artistId, name, price, quantity],
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
