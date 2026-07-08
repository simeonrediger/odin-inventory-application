import {
  MAX_RECORD_NAME_LENGTH,
  MAX_RECORD_PRICE_IN_DOLLARS,
  DEFAULT_RECORD_QUANTITY,
  MAX_RECORD_QUANTITY,
} from '../domains/constants.js';
import { getRecordPath } from '../shared/formatting.js';

export function assign(req, res, next) {
  Object.assign(res.locals, siteLocals);
  next();
}

const siteLocals = {
  siteName: 'Record Store',
  MAX_RECORD_NAME_LENGTH,
  MAX_RECORD_PRICE_IN_DOLLARS,
  DEFAULT_RECORD_QUANTITY,
  MAX_RECORD_QUANTITY,
  centsToDollars,
  formatPrice,
  addThousandsSeparators,
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
