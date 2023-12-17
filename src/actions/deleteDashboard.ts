'use server';

import { prisma } from '../lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const deleteDashboard = async (id: number, prevState: any) => {
  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    await prisma.dashboard.delete({
      where: { id },
    });

    revalidatePath('/dashboard/[id]', 'page');
    return {
      success: true,
      tried: true,
      message: `Dashboard silindi.`,
    };
  } catch (e: any) {
    console.log(e);
    return {
      success: false,
      tried: true,
      message: `Dashboard silinemedi. Hata: ${e?.message}`,
    };
  }
};
