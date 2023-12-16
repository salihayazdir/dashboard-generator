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
import { PlusIcon } from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import React from 'react';
import { addDashboard } from '@/actions/addDashboard';

export default function AddDashboard() {
  const nameRef = React.useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='flex items-center gap-3 w-full'>
          <PlusIcon className='h-4 w-4' />
          <span>Dashboard Ekle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>Dashboard Oluştur</DialogTitle>
          {/* <DialogDescription></DialogDescription> */}
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-4'>
          <form action={addDashboard} className='flex flex-col gap-4'>
            <div className=''>
              <Label htmlFor='name'>İsim</Label>
              <Input ref={nameRef} id='name' name='name' />
            </div>
            <Button type='submit'>Gönder</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
