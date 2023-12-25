import authOptions from '@/app/api/auth/[...nextauth]/options';
import { DashboardSelector } from '@/components/DashboardSelector';
import RevalidateButton from '@/components/RevalidateButton';
import DashboardElement from '@/components/dashboard/DashboardElement';
import AddElement from '@/components/dialog/AddElement';
import DashboardSettings from '@/components/dialog/DashboardSettings';
import { prisma } from '@/lib/prisma';
import { PlusIcon } from '@radix-ui/react-icons';
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
    include: {
      dataSource: {
        select: {
          name: true,
        },
      },
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
              <DashboardSettings dashboard={dashboard} />
            </div>
            {elements.length > 0 ? (
              <div className='flex gap-5'>
                <RevalidateButton path={`/dashboard/${dashboard.id}`} />
                <AddElement
                  dataSourceId={dashboard.dataSourceId}
                  dashboardId={dashboard.id}
                />
              </div>
            ) : null}
          </div>
          {elements.length > 0 ? (
            <div className='p-8 gap-8 grid md:grid-cols-2 lg:grid-cols-3 items-start'>
              {elements.map((element) => (
                <DashboardElement key={element.id} element={element} />
              ))}
            </div>
          ) : (
            <div className='min-h-screen flex items-center flex-col px-10 py-20 gap-6'>
              <h1 className='text-xl font-medium text-gray-800'>
                Bir element ekleyin.
              </h1>
              <AddElement
                dataSourceId={dashboard.dataSourceId}
                size='lg'
                dashboardId={dashboard.id}
              >
                <PlusIcon className='w-6 h-6 mr-3 text-yesil' />
                <span className='text-lg'>Element Ekle</span>
              </AddElement>
            </div>
          )}
        </>
      ) : (
        <div className='min-h-screen flex items-center flex-col px-10 py-20 gap-6'>
          <h1 className='text-xl font-medium text-gray-800'>
            Dashboard Bulunamadı
          </h1>
          <DashboardSelector dashboards={dashboards} />
        </div>
      )}
    </>
  );
}
