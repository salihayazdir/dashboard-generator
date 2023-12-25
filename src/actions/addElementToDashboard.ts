'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const addElementToDashboard = async (
  dashboardId: number,
  prevState: any,
  formData: FormData
) => {
  try {
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
    return {
      success: true,
      tried: true,
      message: `Element dashboard'a eklendi.`,
    };
  } catch (err: any) {
    console.log(err);
    return {
      success: false,
      tried: true,
      message: `Element dashboard'a eklenemedi. Hata: ${err?.message}`,
    };
  }
};
