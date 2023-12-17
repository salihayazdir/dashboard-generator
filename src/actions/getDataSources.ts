'use server';

import authOptions from '@/app/api/auth/[...nextauth]/options';
import { prisma } from '@/lib/prisma';
import { DataSource } from '@prisma/client';
import { getServerSession } from 'next-auth';

export const getDataSources = async (): Promise<string | DataSource[]> => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    const dataSources = await prisma.dataSource.findMany({
      where: {
        ownerId: Number(session.user.id),
      },
    });
    if (!(dataSources.length > 0)) throw 'Sonuç bulunamadı.';
    return dataSources;
  } catch (e: any) {
    console.log(e);
    return e?.message as string;
  }
};
