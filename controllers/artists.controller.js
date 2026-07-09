import { matchedData } from 'express-validator';
import db from '../db/queries.js';

import { queryIsValid } from '../utils/validation-utils.js';

export async function getArtists(req, res) {
  const { artists, genres } = await getPageData(req);
  res.render('artists', { pageName: 'Artists', artists, genres });
}

async function getPageData(req) {
  const artists = await searchArtists(req);
  const genres = await db.genres.find();
  return { artists, genres };
}

async function searchArtists(req) {
  const { genreId, name, recordName } = matchedData(req, {
    locations: ['query'],
  });

  return queryIsValid(req)
    ? await db.artists.find({
        genreId,
        name,
        recordName,
        matchNameSubstring: true,
        includeGenres: true,
        includeRecords: true,
      })
    : [];
}
