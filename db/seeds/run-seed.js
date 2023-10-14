import seed from './seed.js';
import db from '../connection.js';

async function runSeed() {
  await seed();
  await db.end();
}

runSeed();
