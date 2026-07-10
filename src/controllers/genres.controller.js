import { matchedData } from 'express-validator';
import db from '../db/queries.js';

import {
  getErrorsFromLocation,
  queryIsValid,
} from '../validators/validation-utils.js';

export async function getGenres(req, res) {
  const genres = await searchGenres(req);
  res.render('genres', { pageName: 'Genres', genres });
}

export async function createGenre(req, res) {
  const { name, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const genre = { name };
  const errors = getErrorsFromLocation(req, { locations: ['body'] });

  if (errors.length !== 0) {
    const genres = await searchGenres(req);
    return res.status(400).render('genres', {
      pageName: 'Genres',
      genres,
      createFields: genre,
      createErrors: errors,
    });
  }

  await db.genres.create(genre);
  res.redirect(303, returnTo);
}

export async function updateGenre(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const { name, returnTo } = matchedData(req, {
    locations: ['body'],
  });
  const genre = { id, name };
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const genres = await searchGenres(req);
    return res.status(400).render('genres', {
      pageName: 'Genres',
      genres,
      updateFields: genre,
      updateErrors: errors,
    });
  }

  await db.genres.updateById(id, genre);
  res.redirect(303, returnTo);
}

export async function deleteGenre(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const fields = matchedData(req, { locations: ['body'] });
  const { returnTo } = fields;
  const errors = getErrorsFromLocation(req, { locations: ['params', 'body'] });

  if (errors.length !== 0) {
    const genres = await searchGenres(req);
    return res.status(400).render('genres', {
      pageName: 'Genres',
      genres,
      deleteFields: fields,
      deleteErrors: errors,
    });
  }

  await db.genres.deleteById(id);
  res.redirect(303, returnTo);
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
