'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const addElementToDashboard = async (
  dashboardId: number,
  formData: FormData
) => {
  await prisma.dashboardElement.create({
    data: {
      name: formData.get('name') as string,
      dashboard: {
        connect: {
          id: dashboardId,
        },
      },
      fields: formData.get('fields') as string,
      query: formData.get('query') as string,
      type: formData.get('type') as string,
    },
  });

  revalidatePath(`dashboard/${dashboardId}`);
};
