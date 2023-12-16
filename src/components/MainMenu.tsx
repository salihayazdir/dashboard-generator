'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowRightIcon,
  EnvelopeClosedIcon,
  HamburgerMenuIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MainMenu() {
  const { data: session } = useSession();

  const pathname = usePathname();
  const pathIsDashboard = pathname.startsWith('/dashboard') || pathname === '/';
  const pathIsDataSources = pathname === '/veri-kaynaklari';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <HamburgerMenuIcon className='w-4 h-4 text-gray-400' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='min-w-full w-44 text-gray-600'
      >
        <DropdownMenuItem disabled={pathIsDashboard}>
          <Link
            href='/'
            className={cn(
              'flex justify-between items-center w-full',
              pathIsDashboard && 'pointer-events-none'
            )}
          >
            <span
              className={cn(pathIsDashboard && 'text-gray-900 font-semibold')}
            >
              Dashboard'lar
            </span>
            <ArrowRightIcon
              className={cn(
                'w-4 h-4 text-gray-400',
                pathIsDashboard && 'hidden'
              )}
            />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pathIsDataSources}>
          <Link
            href='/veri-kaynaklari'
            className={cn(
              'flex justify-between items-center w-full',
              pathIsDataSources && 'pointer-events-none'
            )}
          >
            <span
              className={cn(pathIsDataSources && 'text-gray-900 font-semibold')}
            >
              Veri Kaynakları
            </span>
            <ArrowRightIcon
              className={cn(
                'w-4 h-4 text-gray-400',
                pathIsDataSources && 'hidden'
              )}
            />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Kullanıcı</DropdownMenuLabel>
          <div className='text-sm px-2 pb-2'>
            <div className='flex items-center gap-2'>
              <PersonIcon className='w-4 h-4 text-gray-400' />
              <span>{session?.user?.name}</span>
            </div>
            <div className='flex items-center text-gray-400 gap-2'>
              <EnvelopeClosedIcon className='w-4 h-4 text-gray-400' />
              <span>{session?.user?.email}</span>
            </div>
          </div>
          <Button
            className='w-full hover:text-red-600'
            size='sm'
            variant='ghost'
            onClick={() => signOut()}
          >
            Çıkış Yap
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
