import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.ELEPHANTSQL_CONN_STR,
  max: 1,
  idleTimeoutMillis: 30000,
});
