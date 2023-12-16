import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../api/auth/[...nextauth]/route';
import AddDataSource from '@/components/dialog/AddDataSource';
import DataSourceSettings from '@/components/dialog/DataSourceSettings';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowTopRightIcon, DashboardIcon } from '@radix-ui/react-icons';

export default async function VeriKaynaklari() {
  const session = await getServerSession(authOptions);
  const dataSources = await prisma.dataSource.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
    include: {
      dashboards: true,
    },
    orderBy: { id: 'asc' },
  });

  return (
    <>
      <div className='bg-slate-50 border-b border-slate-200 py-3 px-8 flex justify-between items-center'>
        <h1 className='text-lg font-semibold'>Veri Kaynakları</h1>
        <AddDataSource />
      </div>
      <div className='p-8 gap-8 grid md:grid-cols-2 items-start'>
        {dataSources.map((dataSource) => {
          return (
            <div
              key={dataSource.id}
              className='bg-white border rounded-lg border-slate-200'
            >
              <div className='flex items-center justify-between py-1 pl-4 pr-1 text-sm border-b border-slate-200'>
                <h2 className='text-lg font-semibold'>{dataSource.name}</h2>
                <div className='flex gap-2'>
                  <DataSourceSettings dataSource={dataSource} />
                </div>
              </div>
              <h3 className='px-4 mt-2 text-sm text-gray-400 font-medium'>
                Bağlı Dashboard'lar
              </h3>
              <div className='flex flex-wrap gap-4 p-4 pt-2'>
                {dataSource.dashboards.map((dashboard) => {
                  return (
                    <Link
                      target='_blank'
                      key={dashboard.id}
                      href={`/dashboard/${dashboard.id}`}
                    >
                      <Button variant='outline'>
                        {dashboard.name}
                        <ArrowTopRightIcon className='h-4 w-4 ml-3' />
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
