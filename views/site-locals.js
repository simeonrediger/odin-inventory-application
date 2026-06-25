export function load(req, res, next) {
  res.locals.siteName = 'Record Store';
  res.locals.getSlug = text => text.toLowerCase().replaceAll(' ', '-');
  res.locals.formatPrice = price => '$' + Number(price / 100).toFixed(2);
  next();
}
