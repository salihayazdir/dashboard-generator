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
import { Dashboard, DataSource } from '@prisma/client';
import Link from 'next/link';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import AddDashboard from './dialog/AddDashboard';
import { getDataSources } from '@/actions/getDataSources';
import LoadingDots from './placeholder/LoadingDots';

export function useDataSourceSelector() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const [dataSources, setDataSources] = React.useState<DataSource[]>([]);
  const [fetchState, setFetchState] = React.useState({
    loading: true,
    error: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      const dataSources = await getDataSources();
      if (typeof dataSources !== 'string') {
        setDataSources(dataSources);
        setValue(dataSources[0].id.toString());
        setFetchState({ loading: false, error: false });
      } else {
        setFetchState({ loading: false, error: true });
      }
    };
    fetchData();
  }, []);

  const DataSourceSelector: React.FC = () => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={fetchState.loading}
          className={cn(
            'w-full justify-between',
            !value && 'text-gray-400 font-normal'
          )}
        >
          {fetchState.loading ? (
            <LoadingDots />
          ) : value ? (
            dataSources.find((dataSource) => dataSource.id.toString() === value)
              ?.name
          ) : (
            'Bir veri kaynağı seçin'
          )}
          <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='p-0'>
        <Command>
          <CommandInput placeholder='Ara...' />
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
          <CommandGroup>
            {dataSources.map((dataSource) => (
              <CommandItem
                key={dataSource.id}
                value={dataSource.id.toString()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue);
                  setOpen(false);
                }}
                className='cursor-pointer'
              >
                <CheckIcon
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === dataSource.id.toString()
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {dataSource.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );

  return { DataSourceSelector, selectedDataSourceId: value };
}
