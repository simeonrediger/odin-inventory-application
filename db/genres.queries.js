import pool from './pool.js';

export async function find({
  name,
  artistName,
  matchNameSubstring = false,
  includeArtists = false,
} = {}) {
  const parameters = [];
  const filters = [];

  let sql = 'SELECT genres.*';

  if (includeArtists) {
    sql += ', a.artists';
  }

  sql += ' FROM genres';

  if (includeArtists) {
    sql += `
      LEFT JOIN LATERAL (
        SELECT COALESCE(
          jsonb_agg(
            to_jsonb(artists)
            ORDER BY artists.name
          ),
          '[]'::jsonb
        ) AS artists
        FROM genre_artists
        INNER JOIN artists
          ON artists.id = genre_artists.artist_id
        WHERE genre_artists.genre_id = genres.id
      ) AS a ON TRUE
    `;
  }

  if (name) {
    parameters.push(matchNameSubstring ? `%${name}%` : name);
    filters.push(`genres.name ILIKE $${parameters.length}`);
  }

  if (artistName) {
    parameters.push(matchNameSubstring ? `%${artistName}%` : artistName);
    filters.push(`
      EXISTS (
        SELECT 1 FROM genre_artists
        INNER JOIN artists
          ON artists.id = genre_artists.artist_id
        WHERE genre_artists.genre_id = genres.id
          AND artists.name ILIKE $${parameters.length}
      )
    `);
  }

  if (filters.length > 0) {
    sql += ` WHERE ${filters.join(' AND ')}`;
  }

  sql += ' ORDER BY genres.name';

  const { rows } = await pool.query(sql, parameters);
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

export async function create({ name }) {
  await pool.query(
    `
    INSERT INTO genres
      (name)
    VALUES
      ($1)
    `,
    [name],
  );
}
