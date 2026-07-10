// npm script:
// "db:init": "node --env-file=.env src/db/scripts/init-db.js"

import { Client } from 'pg';
import fs from 'node:fs/promises';

import { transact } from '../db-utils.js';
import reset from './reset.js';
import seed from './seed.js';

const targetEnv = process.argv[2];
validateEnv(targetEnv);

const databaseUrl =
  targetEnv === 'prod'
    ? process.env.PROD_DATABASE_URL
    : process.env.DATABASE_URL;

await transact(
  { client: new Client({ connectionString: databaseUrl }) },
  async client => {
    console.log(`Resetting tables...`);
    await reset(client);

    console.log(`Seeding tables...`);
    await seed(client);

    console.log('Done');
  },
);

function validateEnv(targetEnv) {
  const errors = [];

  if (targetEnv === 'dev') {
    if (process.env.NODE_ENV !== 'development') {
      errors.push(
        "NODE_ENV environment variable must be 'development' to target dev database",
      );
    }
    if (!process.env.DATABASE_URL) {
      errors.push(
        'DATABASE_URL environment variable must be defined to target dev database',
      );
    }
  } else if (targetEnv === 'prod') {
    if (!process.env.PROD_DATABASE_URL) {
      errors.push(
        'PROD_DATABASE_URL environment variable must be defined to target prod database',
      );
    }
  } else if (!targetEnv) {
    errors.push("You must specify a target environment: 'dev' or 'prod'");
  } else {
    errors.push("Target environment must be 'dev' or 'prod'");
  }

  if (errors.length === 0) {
    return;
  }

  const red = '\x1b[31m';
  const yellow = '\x1b[33m';
  const messages = [
    `${red}Failed to initialize database:${yellow}`,
    ...errors.map(error => `- ${error}`),
  ];
  console.error(messages.join('\n'));
  process.exit(1);
}
