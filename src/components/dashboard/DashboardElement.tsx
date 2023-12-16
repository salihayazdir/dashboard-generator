import DashboardElementSettings from '../dialog/DashboardElementSettings';
import { pool } from '@/lib/pgPool';
import ElementVisualisation from './ElementVisualisation';
import { DashboardElement } from '@prisma/client';

type Props = {
  element: DashboardElement;
};

export default async function DashboardElement({ element }: Props) {
  const { id, name, query, type, fields } = element;
  try {
    const client = await pool.connect();
    const res = await client.query(query);
    client.release();

    const elementData = () => {
      if (fields) {
        return res.rows.map((item) => {
          const newItem: Record<string, unknown> = {};
          JSON.parse(fields).forEach((field: any) => {
            if (field.enabled) {
              newItem[field.newName] = item[field.oldName];
            }
          });
          return newItem;
        });
      } else {
        return res.rows;
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
    return <div>Error</div>;
  }
}
