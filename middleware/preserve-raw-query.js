export default function preserveRawQuery(req, res, next) {
  res.locals.rawQuery = req.query;
  next();
}
