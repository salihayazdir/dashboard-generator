import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

type Props = {
  loading: boolean;
};

export default function ElementPlaceholder({ loading }: Props) {
  return (
    <div>
      <div className='flex items-end w-full gap-3'>
        <Skeleton
          className={cn('w-1/4 h-[300px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[280px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[210px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[270px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[230px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[250px] flex-1', !loading && 'animate-none')}
        />
        <Skeleton
          className={cn('w-1/4 h-[280px] flex-1', !loading && 'animate-none')}
        />
      </div>
    </div>
  );
}
