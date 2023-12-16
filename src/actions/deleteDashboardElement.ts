'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteDashboardElement = async (
  props: {
    id: number;
    dashboardId: number;
  },
  prevState: any
) => {
  const { id, dashboardId } = props;
  try {
    await prisma.dashboardElement.delete({
      where: {
        id,
      },
    });
    revalidatePath(`dashboard/${dashboardId}`);
    return {
      success: true,
      tried: true,
      message: `Element silindi.`,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      tried: true,
      message: `Element silinemedi. Hata: ${e?.message}`,
    };
  }
};
