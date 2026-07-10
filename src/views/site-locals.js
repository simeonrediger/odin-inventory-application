import {
  MAX_GENRE_NAME_LENGTH,
  MAX_ARTIST_NAME_LENGTH,
  MAX_RECORD_NAME_LENGTH,
  MAX_RECORD_PRICE_IN_DOLLARS,
  DEFAULT_RECORD_QUANTITY,
  MAX_RECORD_QUANTITY,
} from '../domains/constants.js';

import { getGenrePath, getArtistPath, getRecordPath } from '../shared/paths.js';

export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
  MAX_GENRE_NAME_LENGTH,
  MAX_ARTIST_NAME_LENGTH,
  MAX_RECORD_NAME_LENGTH,
  MAX_RECORD_PRICE_IN_DOLLARS,
  DEFAULT_RECORD_QUANTITY,
  MAX_RECORD_QUANTITY,
  centsToDollars,
  formatPrice,
  addThousandsSeparators,
  getGenresPath() {
    return '/genres';
  },
  getGenrePath,
  getArtistsPath() {
    return '/artists';
  },
  getArtistPath,
  getRecordsPath() {
    return '/';
  },
  getRecordPath,
};

function formatPrice(price) {
  const dollars = String(centsToDollars(price));
  let [wholeDollars, cents] = dollars.split('.');
  wholeDollars = addThousandsSeparators(wholeDollars);
  return `$${wholeDollars}.${cents}`;
}

function centsToDollars(n) {
  return Number(n / 100).toFixed(2);
}

function addThousandsSeparators(integer) {
  let formattedInteger = String(integer);

  if (formattedInteger.includes('.')) {
    throw new TypeError(`Expected an integer. Got ${integer}`);
  }

  for (let i = formattedInteger.length - 3; i > 0; i -= 3) {
    formattedInteger =
      formattedInteger.slice(0, i) + ',' + formattedInteger.slice(i);
  }

  return formattedInteger;
}
