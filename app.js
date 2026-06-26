import path from 'node:path';
import express from 'express';
import methodOverride from 'method-override';

import * as siteLocals from './views/site-locals.js';
import homeRouter from './routes/home.router.js';
import genresRouter from './routes/genres.router.js';
import artistsRouter from './routes/artists.router.js';
import recordsRouter from './routes/records.router.js';

const app = express();
app.set('views', path.join(import.meta.dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(methodOverride('_method'));
app.use(siteLocals.assign);
app.use('/', homeRouter);
app.use('/genres', genresRouter);
app.use('/artists', artistsRouter);
app.use('/records', recordsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, error => {
  if (error) {
    throw error;
  }

  console.log('Listening on port', PORT);
});
