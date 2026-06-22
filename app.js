import path from 'node:path';
import express from 'express';
import homeRouter from './routes/home.router.js';

const app = express();
app.set('views', path.join(import.meta.dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use('/', homeRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, error => {
  if (error) {
    throw error;
  }

  console.log('Listening on port', PORT);
});
