import DashboardElementSettings from '../dialog/DashboardElementSettings';
import ElementVisualisation from './ElementVisualisation';
import { DashboardElement } from '@prisma/client';
import { executeQueryOnDataSource } from '@/lib/executeQueryOnDataSource';
import { prisma } from '@/lib/prisma';
import ElementPlaceholder from '../placeholder/ElementPlaceholder';
import { CrossCircledIcon } from '@radix-ui/react-icons';

type Props = {
  element: DashboardElement;
};

export default async function DashboardElement({ element }: Props) {
  const { id, name, query, type, fields } = element;
  try {
    const connectionStringQuery = await prisma.dashboardElement.findUnique({
      where: {
        id,
      },
      include: {
        dashboard: {
          include: {
            dataSource: {
              select: {
                connectionString: true,
              },
            },
          },
        },
      },
    });

    console.log(query);

    const connectionString =
      connectionStringQuery?.dashboard?.dataSource?.connectionString ?? '';
    const data = await executeQueryOnDataSource({ connectionString, query });

    const elementData = () => {
      if (fields) {
        return data.map((item) => {
          const newItem: Record<string, unknown> = {};
          JSON.parse(fields).forEach((field: any) => {
            if (field.enabled) {
              newItem[field.newName] = item[field.oldName];
            }
          });
          return newItem;
        });
      } else {
        return data;
      }
    };

    return (
      <div className='bg-white border rounded-lg border-slate-200'>
        <div className='flex items-center justify-between py-1 pl-4 pr-1 text-sm border-b border-slate-200'>
          <h2>{name}</h2>
          <DashboardElementSettings element={element} />
        </div>
        <div className='px-4 py-2'>
          <ElementVisualisation type={type} data={elementData()} />
        </div>
      </div>
    );
  } catch (err: any) {
    console.error(err);
    return (
      <div className='bg-white relative border rounded-lg border-slate-200'>
        <div className='flex items-center justify-between py-1 pl-4 pr-1 text-sm border-b border-slate-200'>
          <h2>{name}</h2>
          <DashboardElementSettings element={element} />
        </div>
        <div className='px-4 py-2'>
          <ElementPlaceholder loading={false} />
          <div className='absolute flex items-center gap-4 p-2 text-sm leading-4 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-60 rounded-md text-rose-700 bg-rose-100 top-1/2 left-1/2'>
            <CrossCircledIcon className='w-6 h-6' />
            <span>{`${err?.message ?? 'Bir hata meydana geldi.'}`}</span>
          </div>
        </div>
      </div>
    );
  }
}
