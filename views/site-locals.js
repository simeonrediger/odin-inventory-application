export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
  getSlug(text) {
    return text.toLowerCase().replaceAll(' ', '-');
  },
  formatPrice(price) {
    return '$' + Number(price / 100).toFixed(2);
  },
};
