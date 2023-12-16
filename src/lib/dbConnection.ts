import { Pool } from 'pg';

export const dbConnection = (connectionString: string) =>
  new Pool({
    connectionString,
    max: 1,
    idleTimeoutMillis: 30000,
  });
