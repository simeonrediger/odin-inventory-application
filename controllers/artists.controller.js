import { matchedData } from 'express-validator';
import db from '../db/queries.js';

import {
  getErrorsFromLocation,
  queryIsValid,
} from '../validators/validation-utils.js';

export async function getArtists(req, res) {
  const { artists, genres } = await getPageData(req);
  res.render('artists', { pageName: 'Artists', artists, genres });
}

export async function createArtist(req, res) {
  const { name, genreIds, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const artist = { name, genreIds };
  const errors = getErrorsFromLocation(req, { locations: ['body'] });

  if (errors.length !== 0) {
    const { artists, genres } = await getPageData(req);
    return res.status(400).render('artists', {
      pageName: 'Artists',
      artists,
      genres,
      createFields: artist,
      createErrors: errors,
    });
  }

  await db.artists.create(artist);
  res.redirect(303, returnTo);
}

export async function updateArtist(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { name, genreIds, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const artist = { id, name, genreIds };
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const { artists, genres } = await getPageData(req);
    return res.status(400).render('artists', {
      pageName: 'Artists',
      artists,
      genres,
      updateFields: artist,
      updateErrors: errors,
    });
  }

  await db.artists.updateById(id, artist);
  res.redirect(303, returnTo);
}

export async function deleteArtist(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const fields = matchedData(req, { locations: ['body'] });
  const { returnTo } = fields;
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const { artists, genres } = await getPageData(req);
    return res.status(400).render('artists', {
      pageName: 'Artists',
      artists,
      genres,
      deleteFields: fields,
      deleteErrors: errors,
    });
  }

  await db.artists.deleteById(id);
  res.redirect(303, returnTo);
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
