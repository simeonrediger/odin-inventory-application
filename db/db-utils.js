export async function transact({ client, pool }, transaction) {
  if (client && pool) {
    throw new Error('Must not provide both a client and a pool');
  } else if (client) {
    await client.connect();
  } else if (pool) {
    client = await pool.connect();
  } else {
    throw new Error('Either a client or a pool is required');
  }

  let result;

  try {
    await client.query('BEGIN');
    result = await transaction(client);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    pool ? await client.release() : await client.end();
  }

  return result;
}
