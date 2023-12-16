'use server';
import { Client } from 'pg';

export const testDbConnection = async (connectionString: string) => {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    await client.query('SELECT 1');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.end();
  }
};
