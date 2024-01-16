'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

type Props = {
  id: number;
  dashboardId: number;
};

export const editDashboardElement = async (
  { id, dashboardId }: Props,
  prevState: any,
  formData: FormData
) => {
  try {
    await prisma.dashboardElement.update({
      where: {
        id,
      },
      data: {
        name: formData.get('name') as string,
        widht: parseInt(formData.get('widht') as string),
        fields: formData.get('fields') as string,
      },
    });

    revalidatePath(`dashboard/${dashboardId}`);
    return {
      success: true,
      tried: true,
      message: `Element güncellendi.`,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      tried: true,
      message: `Element güncellenemedi. Hata: ${e?.message}`,
    };
  }
};
