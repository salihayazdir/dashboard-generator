import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const dataSources = await prisma.dataSource.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
  });

  if (!(dataSources.length > 0)) redirect(`/veri-kaynaklari/`);

  const dashboards = await prisma.dashboard.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
    orderBy: { id: 'asc' },
  });

  if (dashboards.length > 0) redirect(`/dashboard/${dashboards[0].id}`);

  return (
    <>
      <div className='min-h-screen flex flex-col p-10 gap-10'></div>
    </>
  );
}
