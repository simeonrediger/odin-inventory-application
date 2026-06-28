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
  getRecordPath({ id, name } = {}) {
    return id == null ? '/records' : `/records/${id}/${getSlug(name)}`;
  },
};

function getSlug(text) {
  return text.toLowerCase().replaceAll(' ', '-');
}

function centsToDollars(n) {
  return Number(n / 100).toFixed(2);
}
