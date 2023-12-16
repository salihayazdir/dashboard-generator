'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const deleteDataSource = async (id: number, prevState: any) => {
  try {
    await prisma.dataSource.delete({
      where: {
        id,
      },
    });
    revalidatePath('/veri-kaynaklari');
    return {
      success: true,
      tried: true,
      message: `Veri kaynağı silindi.`,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      tried: true,
      message: `Veri kaynağı silinemedi. Hata: ${e?.message}`,
    };
  }
};
