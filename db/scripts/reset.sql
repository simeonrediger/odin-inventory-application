DROP TABLE IF EXISTS genre_artists, genres, artists, records;
DROP DOMAIN IF EXISTS trimmed_nonblank_text;

CREATE DOMAIN trimmed_nonblank_text AS text CHECK (
  VALUE <> ''
  AND VALUE = trim(VALUE)
);

CREATE TABLE genres (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name trimmed_nonblank_text NOT NULL UNIQUE
);

CREATE TABLE artists (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name trimmed_nonblank_text NOT NULL UNIQUE
);

CREATE TABLE genre_artists (
  genre_id integer NOT NULL REFERENCES genres,
  artist_id integer NOT NULL REFERENCES artists,
  PRIMARY KEY (genre_id, artist_id)
);

CREATE TABLE records (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name trimmed_nonblank_text NOT NULL,
  artist_id integer NOT NULL REFERENCES artists,
  UNIQUE (artist_id, name),
  quantity integer NOT NULL DEFAULT 0,
  price bigint NOT NULL CHECK (price >= 0)
);
