import { matchedData } from 'express-validator';
import db from '../db/queries.js';

import { queryIsValid } from '../validators/validation-utils.js';

export async function getGenres(req, res) {
  const genres = await searchGenres(req);
  res.render('genres', { pageName: 'Genres', genres });
}

async function searchGenres(req) {
  const { name, artistName } = matchedData(req, { locations: ['query'] });

  return queryIsValid(req)
    ? await db.genres.find({
        name,
        artistName,
        matchNameSubstring: true,
        includeArtists: true,
      })
    : [];
}
