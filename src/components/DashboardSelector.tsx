'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Dashboard } from '@prisma/client';
import Link from 'next/link';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import AddDashboard from './dialog/AddDashboard';

type Props = {
  dashboards: Dashboard[];
  defaultId?: number;
};

export function DashboardSelector({ dashboards, defaultId }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultId?.toString() ?? '');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className={cn(
            'w-[200px] justify-between',
            !value && 'text-gray-600 font-normal'
          )}
        >
          {value
            ? dashboards.find((dashboard) => dashboard.id.toString() === value)
                ?.name
            : "Dashboard'a Git"}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Ara...' />
          <CommandEmpty>Dashboard bulunamadı.</CommandEmpty>
          <CommandGroup>
            {dashboards.map((dashboard) => (
              <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
                <CommandItem
                  value={dashboard.id.toString()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                  className='cursor-pointer'
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === dashboard.id.toString()
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                  {dashboard.name}
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
          <CommandGroup>
            <AddDashboard className='flex items-center gap-3 w-full' />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
