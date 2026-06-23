DROP TABLE IF EXISTS genre_artists, genres, artists;
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

CREATE OR REPLACE PROCEDURE add_artist_to_genres(
  artist_name text,
  genre_names text[]
)
LANGUAGE sql
AS $$
  INSERT INTO genre_artists (genre_id, artist_id)
  SELECT genres.id, artists.id
  FROM artists
  INNER JOIN genres ON genres.name = ANY(genre_names)
  WHERE artists.name = artist_name;
$$;
