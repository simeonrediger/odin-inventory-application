import db from '../db/queries.js';

export async function getArtists(req, res) {
  const { artists, genres } = await getPageData(req);
  res.render('artists', { pageName: 'Artists', artists, genres });
}

async function getPageData(req) {
  const artists = await db.artists.find({
    includeGenres: true,
    includeRecords: true,
  });

  const genres = await db.genres.find();
  return { artists, genres };
}
