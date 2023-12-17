'use server';

import { Dashboard } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';

export const editDashboard = async (
  dashboard: Dashboard,
  prevState: any,
  formData: FormData
) => {
  const name = formData.get('name') as string;

  try {
    const session = await getServerSession();
    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

    await prisma.dashboard.update({
      where: { id: dashboard.id },
      data: {
        name,
      },
    });

    revalidatePath('/dashboard/[id]', 'page');
    return {
      success: true,
      tried: true,
      message: `Dashboard güncellendi.`,
    };
  } catch (e: any) {
    console.log(e);
    const message = () => {
      if (e?.message.includes('Unique constraint'))
        return 'Bu isimde farklı bir dashboard bulunuyor.';

      return `Hata: ${e?.message}`;
    };
    return {
      success: false,
      tried: true,
      message: `Dashboard güncellenemedi. ${message()}`,
    };
  }
};
