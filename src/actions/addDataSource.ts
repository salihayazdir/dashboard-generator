'use server';

import { getSchemaQuery } from '@/lib/getSchemaQuery';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Client } from 'pg';

export const addDataSource = async (prevState: any, formData: FormData) => {
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

    let schema = null;
    try {
      await client.connect();
      const getSchemaQueryResult = await client.query(getSchemaQuery);
      schema = JSON.stringify(
        getSchemaQueryResult.rows.filter(
          (row) =>
            !(row.table_name.includes('pg_') || row.table_name.includes('sql_'))
        )
      );
    } catch (e) {
      throw new Error('Veri kaynağına bağlanılamadı.');
    }

    const createdDataSource = await prisma.dataSource.create({
      data: {
        name,
        connectionString,
        schema,
        owner: {
          connect: {
            email: session.user.email ?? '',
          },
        },
      },
    });

    revalidatePath('/veri-kaynaklari');
    return {
      success: true,
      tried: true,
      message: `Veri kaynağı oluşturuldu. ID: ${createdDataSource.id}`,
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
      message: `Veri kaynağı oluşturulamadı. ${message()}`,
    };
  }
};
