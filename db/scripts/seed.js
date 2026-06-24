import genres from './genres.js';
import artists from './artists.js';

export default async function seed(client) {
  await seedGenres(client);
  await seedArtists(client);
  await seedGenreArtists(client);
}

async function seedGenres(client) {
  await client.query(
    `
    INSERT INTO genres (name)
    SELECT * FROM unnest($1::text[])
    `,
    [genres],
  );
}

async function seedArtists(client) {
  await client.query(
    `
    INSERT INTO artists (name)
    SELECT name FROM json_to_recordset($1::json)
      AS seed_artists(name text)
    `,
    [JSON.stringify(artists)],
  );
}

async function seedGenreArtists(client) {
  await client.query(
    `
    INSERT INTO genre_artists (genre_id, artist_id)
    SELECT genres.id, artists.id
    FROM json_to_recordset($1::json)
      AS seed_artists(name text, genres text[])
    INNER JOIN genres ON genres.name = ANY(seed_artists.genres)
    INNER JOIN artists ON artists.name = seed_artists.name
    `,
    [JSON.stringify(artists)],
  );
}
