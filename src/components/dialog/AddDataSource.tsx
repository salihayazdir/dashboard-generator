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
import { PlusIcon } from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import React from 'react';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { addDataSource } from '@/actions/addDataSource';
import { SubmitButton } from '../SubmitButton';
import useTestDbConnection from '../TestDbConnection';

export default function AddDataSource({ ...props }: ButtonProps) {
  const { TestDbConnectionButton, connectionTest, setConnectionTest } =
    useTestDbConnection({});

  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const [formState, formAction] = useFormState(addDataSource, initialFormState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          {props.children ? (
            props.children
          ) : (
            <>
              <PlusIcon className='w-4 h-4 mr-2 text-yesil' />
              <span>Veri Kaynağı Ekle</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent forceMount className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Veri Kaynağı Ekle</DialogTitle>
          <DialogDescription>
            {`Dashboard'larınızda kullanabileceğiniz bir PostgreSQL veri tabanı
            tanımlayın.`}
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4'>
          <form action={formAction} className='flex flex-col gap-4'>
            <div>
              <Label htmlFor='name'>İsim</Label>
              <Input required minLength={3} id='name' name='name' />
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='connectionString'>
                Bağlantı Cümlesi (Connection String)
              </Label>
              <Input
                required
                minLength={10}
                type='url'
                value={connectionTest.string}
                onChange={(e) => {
                  setConnectionTest((prev) => ({
                    ...prev,
                    string: e.target.value,
                  }));
                }}
                id='connectionString'
                name='connectionString'
              />
              <TestDbConnectionButton />
            </div>

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
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
