export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
  getSlug,
  formatPrice(price) {
    return '$' + Number(price / 100).toFixed(2);
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
  getRecordPath({ id, name }) {
    return `/records/${id}/${getSlug(name)}`;
  },
};

function getSlug(text) {
  return text.toLowerCase().replaceAll(' ', '-');
}
