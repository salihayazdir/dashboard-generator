import { testDbConnection } from '@/actions/testDbConnection';
import { Button } from './ui/button';
import LoadingDots from './placeholder/LoadingDots';
import { useState } from 'react';
import {
  Cross1Icon,
  ExclamationTriangleIcon,
  Link2Icon,
  LinkBreak1Icon,
} from '@radix-ui/react-icons';
import { cn, isJsonString } from '@/lib/utils';
import { DataSource } from '@prisma/client';
import { updateDbSchema } from '@/actions/updateDbSchema';

type Props = {
  dataSource: DataSource;
};

export default function useUpdateDbSchema({ dataSource }: Props) {
  const [dbSchemaState, setDbSchemaState] = useState({
    loading: false,
    success: false,
    tried: false,
  });

  const { loading, success, tried } = dbSchemaState;

  const UpdateDbSchemaButton: React.FC = () => (
    <div className='flex flex-col gap-2'>
      {!Boolean(dataSource.connectionString) ? (
        <div className='flex items-center bg-yellow-50 justify-center leading-5 text-yellow-700 text-sm rounded-md p-2 pr-8 pl-4'>
          <span className=''>
            <ExclamationTriangleIcon className='h-5 w-5 mr-4' />
          </span>
          <span>
            Şema oluşturabilmek için bir bağlantı cümlesi tanımlamalısınız.
          </span>
        </div>
      ) : null}
      <Button
        variant='outline'
        disabled={!Boolean(dataSource.connectionString)}
        onClick={async (e) => {
          e.preventDefault();
          setDbSchemaState((prev) => ({
            ...prev,
            tried: true,
            loading: true,
          }));
          const res = await updateDbSchema(dataSource);
          if (res) {
            setDbSchemaState((prev) => ({
              ...prev,
              loading: false,
              success: true,
            }));
          } else {
            setDbSchemaState((prev) => ({
              ...prev,
              loading: false,
              success: false,
            }));
          }
        }}
      >
        {loading ? (
          <LoadingDots />
        ) : dataSource.schema ? (
          'Şemayı Güncelle'
        ) : (
          'Şema Oluştur'
        )}
      </Button>

      {tried && !loading ? (
        <div
          className={cn(
            'flex items-center bg-slate-50 justify-center text-sm rounded-md p-2 pr-8 pl-4',
            {
              'text-red-700': !success,
              'bg-red-50': !success,
              'text-green-700': success,
              'bg-green-50': success,
            }
          )}
        >
          {tried && !loading && success ? (
            <>
              <Link2Icon className='h-4 w-4 mr-3' />
              {dataSource.schema ? 'Şema Güncellendi' : 'Şema Oluşturuldu'}
            </>
          ) : null}
          {tried && !loading && !success ? (
            <>
              <LinkBreak1Icon className='h-4 w-4 mr-3' />
              {dataSource.schema ? (
                'Şema Güncellenemedi'
              ) : (
                <span>
                  Şema Oluşturulamadı.
                  <br /> Bağlantı cümlesinin doğru olduğundan emin olun.
                </span>
              )}
            </>
          ) : null}

          {!loading ? (
            <Button
              className='absolute right-8'
              variant='ghost'
              size='icon'
              onClick={() => {
                setDbSchemaState((prev) => ({
                  ...prev,
                  tried: false,
                }));
              }}
            >
              <Cross1Icon className='h-3 w-3' />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  return { UpdateDbSchemaButton, dbSchemaState, setDbSchemaState };
}
