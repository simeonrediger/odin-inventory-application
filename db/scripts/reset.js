import {
  MAX_GENRE_NAME_LENGTH,
  MAX_ARTIST_NAME_LENGTH,
  MAX_RECORD_NAME_LENGTH,
  DEFAULT_RECORD_QUANTITY,
} from '../../domains/constants.js';

export default async function reset(client) {
  await deleteAll(client);
  await createDomains(client);
  await createGenresTable(client);
  await createArtistsTable(client);
  await createGenreArtistsTable(client);
  await createRecordsTable(client);
}

async function deleteAll(client) {
  await client.query(`
    DROP TABLE IF EXISTS
      genre_artists,
      genres,
      artists,
      records;

    DROP DOMAIN IF EXISTS
      trimmed_nonblank_text;
  `);
}

async function createDomains(client) {
  await client.query(`
    CREATE DOMAIN trimmed_nonblank_text AS text
      CHECK (
        VALUE <> ''
        AND VALUE = trim(VALUE)
      )
  `);
}

async function createGenresTable(client) {
  await client.query(`
    CREATE TABLE genres (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name trimmed_nonblank_text NOT NULL UNIQUE
        CHECK (length(name) <= ${MAX_GENRE_NAME_LENGTH})
    )
  `);
}

async function createArtistsTable(client) {
  await client.query(`
    CREATE TABLE artists (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      name trimmed_nonblank_text NOT NULL UNIQUE
        CHECK (length(name) <= ${MAX_ARTIST_NAME_LENGTH})
    )
  `);
}

async function createGenreArtistsTable(client) {
  await client.query(`
    CREATE TABLE genre_artists (
      genre_id integer NOT NULL REFERENCES genres,
      artist_id integer NOT NULL REFERENCES artists,
      PRIMARY KEY (genre_id, artist_id)
    )
  `);
}

async function createRecordsTable(client) {
  await client.query(`
    CREATE TABLE records (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      artist_id integer NOT NULL REFERENCES artists,
      name trimmed_nonblank_text NOT NULL
        CHECK (length(name) <= ${MAX_RECORD_NAME_LENGTH}),
      UNIQUE (artist_id, name),
      price bigint NOT NULL
        CHECK (price >= 0),
      quantity integer NOT NULL
        DEFAULT ${DEFAULT_RECORD_QUANTITY}
    )
  `);
}
