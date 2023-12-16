import { testDbConnection } from '@/actions/testDbConnection';
import { Button } from './ui/button';
import LoadingDots from './placeholder/LoadingDots';
import { useState } from 'react';
import { Cross1Icon, Link2Icon, LinkBreak1Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

type Props = {
  initialString?: string;
};

export default function useTestDbConnection(props: Props) {
  const [connectionTest, setConnectionTest] = useState({
    string: props.initialString ?? '',
    loading: false,
    success: false,
    tried: false,
  });

  const TestDbConnectionButton: React.FC = () => (
    <div className='flex flex-col gap-2'>
      <Button
        variant='outline'
        disabled={connectionTest.string.length < 10}
        onClick={async (e) => {
          e.preventDefault();
          setConnectionTest((prev) => ({
            ...prev,
            tried: true,
            loading: true,
          }));
          const res = await testDbConnection(connectionTest.string);
          if (res) {
            setConnectionTest((prev) => ({
              ...prev,
              loading: false,
              success: true,
            }));
          } else {
            setConnectionTest((prev) => ({
              ...prev,
              loading: false,
              success: false,
            }));
          }
        }}
      >
        {connectionTest.loading ? <LoadingDots /> : 'Bağlantıyı Test Et'}
      </Button>

      {connectionTest.tried && !connectionTest.loading ? (
        <div
          className={cn(
            'flex items-center bg-slate-50 justify-center text-sm rounded-md p-2',
            {
              'text-red-700': !connectionTest.success,
              'bg-red-50': !connectionTest.success,
              'text-green-700': connectionTest.success,
              'bg-green-50': connectionTest.success,
            }
          )}
        >
          {connectionTest.tried &&
          !connectionTest.loading &&
          connectionTest.success ? (
            <>
              <Link2Icon className='h-4 w-4 mr-3' />
              Bağlantı Başarılı
            </>
          ) : null}
          {connectionTest.tried &&
          !connectionTest.loading &&
          !connectionTest.success ? (
            <>
              <LinkBreak1Icon className='h-4 w-4 mr-3' />
              Bağlantı Başarısız
            </>
          ) : null}
          {!connectionTest.loading ? (
            <Button
              className='absolute right-8 hover:bg-opacity-25'
              variant='ghost'
              size='icon'
              onClick={() => {
                setConnectionTest((prev) => ({
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

  return { TestDbConnectionButton, connectionTest, setConnectionTest };
}
