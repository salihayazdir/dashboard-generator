import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import LoadingDots from '@/components/placeholder/LoadingDots';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import AddDashboard from '@/components/dialog/AddDashboard';
import authOptions from '../api/auth/[...nextauth]/options';

export default async function Home() {
  const session = await getServerSession(authOptions);

  const dashboards = await prisma.dashboard.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
    orderBy: { id: 'asc' },
  });

  if (dashboards.length > 0) redirect(`/dashboard/${dashboards[0].id}`);

  const dataSources = await prisma.dataSource.findMany({
    where: {
      ownerId: parseInt(session?.user?.id ?? '0'),
    },
  });

  return (
    <>
      <div className='min-h-screen flex items-center flex-col px-10 py-20 gap-6'>
        {dataSources.length > 0 ? (
          <>
            <h1 className='text-xl font-medium text-gray-800'>
              Bir dashboard ekleyin.
            </h1>
            <AddDashboard size='lg'>
              <PlusIcon className='mr-4 h-6 w-6 text-yesil' />
              <span className='text-lg'>Dashboard Ekle</span>
            </AddDashboard>
          </>
        ) : (
          <>
            <h1 className='text-xl font-medium text-gray-800'>
              Bir veri kaynağı ekleyerek başlayın.
            </h1>
            <Link href='/veri-kaynaklari'>
              <Button size='lg'>
                <span className='text-lg'>Veri Kaynakları</span>
                <ArrowRightIcon className='ml-4 h-6 w-6 text-yesil' />
              </Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
