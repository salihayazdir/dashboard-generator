'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const addDashboard = async (formData: FormData) => {
  const dataSourceId = 1;
  const session = await getServerSession();
  console.log(session);
  if (!session) return;
  const createdDashboard = await prisma.dashboard.create({
    data: {
      name: formData.get('name') as string,
      dataSource: {
        connect: {
          id: dataSourceId,
        },
      },
      owner: {
        connect: {
          email: session.user.email ?? '',
        },
      },
    },
  });

  revalidatePath('/dashboards');
  return createdDashboard.id;
};
