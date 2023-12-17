'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const addDashboard = async (prevState: any, formData: FormData) => {
  const dataSourceId = Number(formData.get('selectedDataSourceId') as string);

  try {
    const session = await getServerSession();

    if (!session) {
      throw new Error('Kullanıcı bulunamadı.');
    }

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

    revalidatePath('/dashboard/[id]', 'page');

    return {
      success: true,
      tried: true,
      message: `Dashboard oluşturuldu. ID: ${createdDashboard.id}`,
      dashboardId: createdDashboard.id,
    };
  } catch (err: any) {
    console.log(err);
    const message = () => {
      if (err?.message.includes('Unique constraint'))
        return 'Bu isimde farklı bir dashboard bulunuyor.';

      return `Hata: ${err?.message}`;
    };
    return {
      success: false,
      tried: true,
      message: `Dashboard oluşturulamadı. ${message()}`,
    };
  }
};
