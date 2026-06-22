DROP TABLE IF EXISTS artists;
DROP DOMAIN IF EXISTS trimmed_nonblank_text;

CREATE DOMAIN trimmed_nonblank_text AS text CHECK (
  VALUE <> ''
  AND VALUE = trim(VALUE)
);

CREATE TABLE artists (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name trimmed_nonblank_text NOT NULL
);
