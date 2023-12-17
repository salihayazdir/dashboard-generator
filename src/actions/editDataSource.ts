'use server';

import { getSchemaQuery } from '@/lib/getSchemaQuery';
import { prisma } from '@/lib/prisma';
import { DataSource } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Client } from 'pg';

export const editDataSource = async (
  dataSource: DataSource,
  prevState: any,
  formData: FormData
) => {
  const name = formData.get('name') as string;
  const connectionString = formData.get('connectionString') as string;

  const client = new Client({
    connectionString,
  });

  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    let newSchema = dataSource.schema;
    if (dataSource.connectionString !== connectionString) {
      try {
        await client.connect();
        const getSchemaQueryResult = await client.query(getSchemaQuery);
        newSchema = JSON.stringify(
          getSchemaQueryResult.rows.filter(
            (row) =>
              !(
                row.table_name.includes('pg_') ||
                row.table_name.includes('sql_')
              )
          )
        );
      } catch (e) {
        throw new Error('Veri kaynağına bağlanılamadı.');
      }
    }

    await prisma.dataSource.update({
      where: { id: dataSource.id },
      data: {
        name,
        connectionString,
        schema: newSchema,
      },
    });

    revalidatePath('/veri-kaynaklari');
    return {
      success: true,
      tried: true,
      message: `Veri kaynağı güncellendi.`,
    };
  } catch (e: any) {
    console.log(e);

    const message = () => {
      if (e?.message.includes('Unique constraint'))
        return 'Bu isimde farklı bir veri kaynağı bulunuyor.';

      return `Hata: ${e?.message}`;
    };
    return {
      success: false,
      tried: true,
      message: `Veri kaynağı güncellenemedi. ${message()}`,
    };
  }
};
