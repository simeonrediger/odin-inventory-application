import * as db from '../db/records.queries.js';

export async function getRecords(req, res) {
  const records = await db.findRecords();
  res.render('records', { pageName: 'Records', records });
}
