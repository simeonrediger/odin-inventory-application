import { getSlug, getRecordPath } from '../shared/formatting.js';

export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
  getSlug,
  centsToDollars,
  formatPrice(price) {
    return '$' + centsToDollars(price);
  },
  getHomePath() {
    return '/';
  },
  getGenresPath() {
    return '/genres';
  },
  getGenrePath({ id, name }) {
    return `/genres/${id}/${getSlug(name)}`;
  },
  getArtistsPath() {
    return '/artists';
  },
  getArtistPath({ id, name }) {
    return `/artists/${id}/${getSlug(name)}`;
  },
  getRecordsPath() {
    return '/records';
  },
  getRecordPath,
};

function centsToDollars(n) {
  return Number(n / 100).toFixed(2);
}
