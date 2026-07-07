import { getRecordPath } from '../shared/formatting.js';

export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
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
  getGenrePath({ id }) {
    return `/genres/${id}`;
  },
  getArtistsPath() {
    return '/artists';
  },
  getArtistPath({ id }) {
    return `/artists/${id}`;
  },
  getRecordsPath() {
    return '/records';
  },
  getRecordPath,
};

function centsToDollars(n) {
  return Number(n / 100).toFixed(2);
}
