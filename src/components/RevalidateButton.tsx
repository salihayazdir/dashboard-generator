'use client';

import { UpdateIcon } from '@radix-ui/react-icons';
import { Button, ButtonProps } from './ui/button';
import { revalidatePage } from '@/actions/revalidatePage';
// import { useRouter } from 'next/navigation';

type Props = {
  path: string;
} & ButtonProps;

export default function RevalidateButton({ path, ...props }: Props) {
  //   const router = useRouter();
  return (
    <Button
      {...props}
      onClick={() => {
        // router.refresh();
        revalidatePage(path);
      }}
      variant='outline'
      className='group'
    >
      <UpdateIcon className='h-4 w-4 mr-2 text-yesil group-hover:rotate-180 transition-all duration-500' />
      Yenile
    </Button>
  );
}
