'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  ArrowRightIcon,
  GearIcon,
  InfoCircledIcon,
} from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import React, { useEffect, useState } from 'react';
import { editDashboard } from '@/actions/editDashboard';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../SubmitButton';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Dashboard, Prisma } from '@prisma/client';
import { deleteDashboard } from '@/actions/deleteDashboard';

type Props = {
  dashboard: Prisma.DashboardGetPayload<{
    include: {
      dataSource: {
        select: {
          name: true;
        };
      };
    };
  }>;
};

{
}

export default function DashboardSettings({ dashboard }: Props) {
  const [open, setOpen] = useState(false);

  // UPDATE FORM STATE
  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_editDashboard = editDashboard.bind(null, dashboard);
  const [formState, formAction] = useFormState(
    bound_editDashboard,
    initialFormState
  );

  // DELETE FORM STATE
  const delete_initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_deleteDashboard = deleteDashboard.bind(null, dashboard.id);
  const [delete_formState, delete_formAction] = useFormState(
    bound_deleteDashboard,
    delete_initialFormState
  );

  // SHOW / HIDE DELETE BUTTON
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  useEffect(() => {
    if (delete_formState.success) {
      setOpen(false);
    }
  }, [delete_formState]);

  // SHOW / HIDE RESPONSE MESSAGE
  const [showResponseMessage, setShowResponseMessage] = useState(false);
  useEffect(() => {
    if (formState.tried) {
      setShowResponseMessage(true);
    }
  }, [formState]);

  return (
    <Dialog
      onOpenChange={(open) => {
        setOpen(open);
        setShowDeleteButton(false);
        setShowResponseMessage(false);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button variant='ghost' size={'icon'}>
          <GearIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>{dashboard.name}</DialogTitle>
          <DialogDescription>{`Dashboard'u düzenleyin.`}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-4'>
          <form action={formAction} className='flex flex-col gap-4'>
            <div className=''>
              <Label htmlFor='name'>İsim</Label>
              <Input defaultValue={dashboard.name} id='name' name='name' />
            </div>
            <div className=''>
              <Label>Veri Kaynağı</Label>
              <Input
                disabled
                value={`${dashboard.dataSourceId} | ${dashboard.dataSource.name}`}
              />
              <div className='flex items-center mt-2 text-xs gap-2 text-gray-600'>
                <InfoCircledIcon className='h-4 w-4' />
                <span>Dashboard veri kaynağı sonradan değiştirilemez.</span>
              </div>
            </div>
            <div></div>
            <SubmitButton>Kaydet</SubmitButton>
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
          <form action={delete_formAction}>
            {showDeleteButton ? (
              <div className='flex gap-2 justify-between'>
                <SubmitButton className='w-full' variant='destructive'>
                  Silmek İçin Tıklayın
                </SubmitButton>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => setShowDeleteButton(false)}
                >
                  Vazgeç
                </Button>
              </div>
            ) : (
              <Button
                type='button'
                className='w-full text-red-300 hover:text-red-600 hover:bg-red-50'
                onClick={() => setShowDeleteButton(true)}
                variant='ghost'
              >
                Sil
              </Button>
            )}
            {delete_formState.tried &&
            !delete_formState.success &&
            showDeleteButton ? (
              <div className='flex mt-4 items-center text-red-700 bg-red-50 justify-center text-sm rounded-md py-2 px-4'>
                {delete_formState.message}
              </div>
            ) : null}
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
