import pool from './pool.js';

export async function find({
  genreId,
  artistId,
  name,
  matchNameSubstring = false,
  includeArtist = false,
} = {}) {
  const parameters = [];
  const filters = [];

  let sql = 'SELECT records.*';

  if (includeArtist) {
    sql += ', to_jsonb(artists) AS artist';
  }

  sql += ' FROM records';

  if (includeArtist) {
    const join = artistId ? 'INNER JOIN' : 'LEFT JOIN';

    sql += `
      ${join} artists
        ON artists.id = records.artist_id
    `;
  }

  if (genreId) {
    parameters.push(genreId);
    sql += `
      INNER JOIN genre_artists
        ON genre_artists.artist_id = artists.id
    `;
    filters.push(`genre_artists.genre_id = $${parameters.length}`);
  }

  if (artistId) {
    parameters.push(artistId);
    filters.push(`records.artist_id = $${parameters.length}`);
  }

  if (name) {
    parameters.push(matchNameSubstring ? `%${name}%` : name);
    filters.push(`records.name ILIKE $${parameters.length}`);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  sql += ' ORDER BY records.name, artists.name';

  const { rows } = await pool.query(sql, parameters);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM records
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
}

export async function create({ artistId, name, price, quantity }) {
  const parameters = [artistId, name, price];

  if (quantity) {
    parameters.push(quantity);
  }

  await pool.query(
    `
    INSERT INTO records
      (artist_id, name, price${quantity ? ', quantity' : ''})
    VALUES
      ($1, $2, $3${quantity ? ', $4' : ''})
    `,
    parameters,
  );
}

export async function updateById(id, { artistId, name, price, quantity }) {
  await pool.query(
    `
    UPDATE records
    SET
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
