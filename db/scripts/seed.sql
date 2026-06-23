INSERT INTO genres
  (name)
VALUES
  ('alternative'),
  ('blues'),
  ('classical'),
  ('country'),
  ('dance'),
  ('electronic'),
  ('emo'),
  ('hip-hop'),
  ('indie'),
  ('jazz'),
  ('metal'),
  ('pop'),
  ('punk'),
  ('rock');

INSERT INTO artists
  (name)
VALUES
  ('A Perfect Circle'),
  ('Carpenter Brut'),
  ('Jimmy Eat World'),
  ('Nothing But Thieves'),
  ('Queens of the Stone Age'),
  ('Radiohead'),
  ('RÜFÜS DU SOL'),
  ('So Below'),
  ('Spoon'),
  ('System of a Down'),
  ('The Shins'),
  ('The Strokes'),
  ('Tool'),
  ('Two Door Cinema Club'),
  ('White Lies');

CALL add_artist_to_genres(
  'A Perfect Circle',
  ARRAY['rock', 'metal', 'alternative']
);
CALL add_artist_to_genres(
  'Carpenter Brut',
  ARRAY['electronic']
);
CALL add_artist_to_genres(
  'Jimmy Eat World',
  ARRAY['rock', 'punk', 'pop', 'emo']
);
CALL add_artist_to_genres(
  'Nothing But Thieves',
  ARRAY['rock', 'alternative', 'pop']
);
CALL add_artist_to_genres(
  'Queens of the Stone Age',
  ARRAY['rock', 'metal', 'alternative']
);
CALL add_artist_to_genres(
  'Radiohead',
  ARRAY['rock', 'indie', 'alternative']
);
CALL add_artist_to_genres(
  'RÜFÜS DU SOL',
  ARRAY['electronic', 'dance']
);
CALL add_artist_to_genres(
  'So Below',
  ARRAY['electronic', 'indie', 'pop']
);
CALL add_artist_to_genres(
  'Spoon',
  ARRAY['rock', 'indie', 'alternative']
);
CALL add_artist_to_genres(
  'System of a Down',
  ARRAY['rock', 'metal', 'alternative']
);
CALL add_artist_to_genres(
  'The Shins',
  ARRAY['indie', 'rock', 'pop', 'alternative']
);
CALL add_artist_to_genres(
  'The Strokes',
  ARRAY['rock', 'indie', 'alternative']
);
CALL add_artist_to_genres(
  'Tool',
  ARRAY['rock', 'metal', 'alternative']
);
CALL add_artist_to_genres(
  'Two Door Cinema Club',
  ARRAY['indie', 'rock', 'alternative']
);
CALL add_artist_to_genres(
  'White Lies',
  ARRAY['rock', 'indie', 'dance', 'alternative']
);
