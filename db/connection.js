import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL not set');
}

const pool = new Pool({ connectionString });

export default pool;
