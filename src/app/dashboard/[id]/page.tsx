import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DashboardSelector } from '@/components/DashboardSelector';
import DashboardElement from '@/components/dashboard/DashboardElement';
import AddElement from '@/components/dialog/AddElement';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { GearIcon } from '@radix-ui/react-icons';
import { getServerSession } from 'next-auth';

export default async function Dashboard({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  const dashboards = await prisma.dashboard.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
    orderBy: { id: 'asc' },
  });

  const dashboard = dashboards.find(
    (dashboard) => dashboard.id === parseInt(params.id)
  );

  const elements = await prisma.dashboardElement.findMany({
    where: {
      dashboardId: dashboard?.id ?? 0,
    },
    orderBy: { id: 'asc' },
  });

  return (
    <>
      {dashboard ? (
        <>
          <div className='bg-slate-50 border-b border-slate-200 py-3 px-8 flex justify-between items-center'>
            <div className='flex gap-2'>
              <DashboardSelector
                dashboards={dashboards}
                defaultId={dashboard.id}
              />
              <Button variant='ghost' size={'icon'}>
                <GearIcon className='h-4 w-4' />
              </Button>
            </div>
            <AddElement dashboardId={dashboard.id} />
          </div>
          <div className='p-8 gap-8 grid md:grid-cols-2 lg:grid-cols-3 items-start'>
            {elements.map((element) => (
              <DashboardElement key={element.id} element={element} />
            ))}
          </div>
        </>
      ) : (
        <div>Dashboard bulunamadı</div>
      )}
    </>
  );
}
