import pool from './pool.js';
import { transact } from './db-utils.js';

export async function find({
  genreId,
  name,
  recordName,
  matchNameSubstring = false,
  includeGenres = false,
  includeRecords = false,
} = {}) {
  const parameters = [];
  const filters = [];

  let sql = 'SELECT artists.*';

  if (includeGenres) {
    sql += ', g.genres';
  }

  if (includeRecords) {
    sql += ', r.records';
  }

  sql += ' FROM artists';

  if (includeGenres) {
    sql += `
      LEFT JOIN LATERAL (
        SELECT COALESCE(
          jsonb_agg(
            to_jsonb(genres)
            ORDER BY genres.name
          ),
          '[]'::jsonb
        ) AS genres
        FROM genre_artists
        INNER JOIN genres
          ON genres.id = genre_artists.genre_id
        WHERE genre_artists.artist_id = artists.id
      ) AS g ON TRUE
    `;
  }

  if (includeRecords) {
    sql += `
      LEFT JOIN LATERAL (
        SELECT COALESCE(
          jsonb_agg(
            to_jsonb(records)
            ORDER BY records.name
          ),
          '[]'::jsonb
        ) AS records
        FROM records
        WHERE records.artist_id = artists.id
      ) AS r ON TRUE
    `;
  }

  if (genreId) {
    parameters.push(genreId);
    filters.push(`
      EXISTS (
        SELECT 1 FROM genre_artists
        WHERE genre_artists.artist_id = artists.id
          AND genre_artists.genre_id = $${parameters.length}
      )
    `);
  }

  if (name) {
    parameters.push(matchNameSubstring ? `%${name}%` : name);
    filters.push(`artists.name ILIKE $${parameters.length}`);
  }

  if (recordName) {
    parameters.push(matchNameSubstring ? `%${recordName}%` : recordName);
    filters.push(`
      EXISTS (
        SELECT 1 FROM records
        WHERE records.artist_id = artists.id
          AND records.name ILIKE $${parameters.length}
      )
    `);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  sql += ' ORDER BY artists.name';

  const { rows } = await pool.query(sql, parameters);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `
    SELECT * FROM artists
    WHERE id = $1
    `,
    [id],
  );

  return rows[0];
}

export async function create({ name, genreIds }) {
  await transact({ pool }, async client => {
    const {
      rows: [{ id }],
    } = await client.query(
      `
      INSERT INTO artists
        (name)
      VALUES
        ($1)
      RETURNING id
      `,
      [name],
    );

    if (genreIds?.length > 0) {
      await client.query(
        `
        INSERT INTO genre_artists
          (genre_id, artist_id)
        SELECT genre_id, $1
        FROM unnest($2::int[]) AS genre_id
        `,
        [id, genreIds],
      );
    }
  });
}

export async function updateById(id, { name, genreIds }) {
  await transact({ pool }, async client => {
    await client.query(
      `
      UPDATE artists
      SET name = $2
      WHERE id = $1
      `,
      [id, name],
    );

    await client.query(
      `
      DELETE FROM genre_artists
      WHERE artist_id = $1
        AND NOT (genre_id = ANY($2::int[]))
      `,
      [id, genreIds],
    );

    await client.query(
      `
      INSERT INTO genre_artists
        (genre_id, artist_id)
      SELECT genre_id, $1
      FROM unnest($2::int[]) AS genre_id
      ON CONFLICT (genre_id, artist_id) DO NOTHING
      `,
      [id, genreIds],
    );
  });
}

export async function deleteById(id) {
  await pool.query(
    `
    DELETE FROM artists
    WHERE artists.id = $1
    `,
    [id],
  );
}
