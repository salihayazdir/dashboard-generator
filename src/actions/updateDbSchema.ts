'use server';
import { getSchemaQuery } from '@/lib/getSchemaQuery';
import { prisma } from '@/lib/prisma';
import { DataSource } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { Client } from 'pg';

export const updateDbSchema = async (dataSource: DataSource) => {
  const { id, connectionString } = dataSource;

  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();

    const getSchemaQueryResult = await client.query(getSchemaQuery);
    const newSchema = JSON.stringify(
      getSchemaQueryResult.rows.filter(
        (row) =>
          !(row.table_name.includes('pg_') || row.table_name.includes('sql_'))
      )
    );

    await prisma.dataSource.update({
      where: {
        id,
      },
      data: {
        schema: newSchema,
      },
    });

    revalidatePath('/veri-kaynaklari');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.end();
  }
};
