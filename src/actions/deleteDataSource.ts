'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const deleteDataSource = async (id: number, prevState: any) => {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

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

    const message = () => {
      if (e?.message.includes('Foreign key constraint'))
        return "Bu veri kaynağına bağlı dashboard'lar bulunuyor.";

      return `Hata: ${e?.message}`;
    };

    return {
      success: false,
      tried: true,
      message: `Veri kaynağı silinemedi. ${message()}`,
    };
  }
};
