import { Client } from 'pg';

export const executeQueryOnDataSource = async ({
  connectionString,
  query,
}: {
  connectionString: string;
  query: string;
}) => {
  const client = new Client({
    connectionString,
  });
  try {
    await client.connect();
    const result = await client.query(query);
    return result.rows;
  } catch (err: any) {
    console.log('//// err ', err);
    throw new Error(err);
  } finally {
    await client.end();
  }
};
