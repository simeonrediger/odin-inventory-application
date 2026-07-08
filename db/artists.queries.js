import pool from './pool.js';

export async function find({
  includeGenres = false,
  includeRecords = false,
} = {}) {
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

  sql += ' ORDER BY artists.name';

  const { rows } = await pool.query(sql);
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
