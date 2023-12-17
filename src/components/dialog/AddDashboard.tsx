'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ArrowRightIcon, PlusIcon } from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import React from 'react';
import { addDashboard } from '@/actions/addDashboard';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../SubmitButton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useDataSourceSelector } from '../DataSourceSelector';

export default function AddDashboard(buttonProps: ButtonProps) {
  const nameRef = React.useRef<HTMLInputElement>(null);
  const { DataSourceSelector, selectedDataSourceId } = useDataSourceSelector();

  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const [formState, formAction] = useFormState(addDashboard, initialFormState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...buttonProps}>
          {buttonProps.children ? (
            buttonProps.children
          ) : (
            <>
              <PlusIcon className='h-4 w-4' />
              <span>Dashboard Ekle</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Dashboard Oluştur</DialogTitle>
          <DialogDescription>Yeni bir dashboard oluşturun.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-4'>
          <form action={formAction} className='flex flex-col gap-4'>
            <div className=''>
              <Label htmlFor='name'>İsim</Label>
              <Input ref={nameRef} id='name' name='name' />
            </div>
            <div className=''>
              <Label>Veri Kaynağı</Label>
              <input
                readOnly
                hidden
                name='selectedDataSourceId'
                id='selectedDataSourceId'
                value={selectedDataSourceId}
              />
              <DataSourceSelector />
            </div>
            <div></div>
            <SubmitButton />
            {formState.tried ? (
              <div
                className={cn(
                  'flex items-center bg-slate-50 justify-center text-sm rounded-md py-2 px-4',
                  {
                    'text-red-700': !formState.success,
                    'bg-red-50': !formState.success,
                    'text-green-700': formState.success,
                    'bg-green-50': formState.success,
                  }
                )}
              >
                {formState.message}
              </div>
            ) : null}
            {formState?.dashboardId ? (
              <Link href={`/dashboard/${formState?.dashboardId}`}>
                <Button variant='outline' className='w-full'>
                  {`Dashboard'a Git`}
                  <ArrowRightIcon className='h-4 w-4 ml-3' />
                </Button>
              </Link>
            ) : null}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
