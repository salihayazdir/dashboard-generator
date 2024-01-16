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
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import { editDashboardElement } from '@/actions/editDashboardElement';
import React, { useEffect, useState } from 'react';
import { DashboardElement } from '@prisma/client';
import { deleteDashboardElement } from '@/actions/deleteDashboardElement';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../SubmitButton';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

type Props = {
  element: DashboardElement;
};

type Fields = {
  enabled: boolean;
  newName: string;
  oldName: string;
}[];

export default function DashboardElementSettings({
  element: { id, name, query, dashboardId, type, widht, fields: initialFields },
}: Props) {
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<Fields>(
    JSON.parse(initialFields ?? '[]')
  );

  const nameRef = React.useRef<HTMLInputElement>(null);
  const widhtRef = React.useRef<HTMLInputElement>(null);

  // UPDATE FORM STATE
  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_editDashboardElement = editDashboardElement.bind(null, {
    id,
    dashboardId,
  });
  const [formState, formAction] = useFormState(
    bound_editDashboardElement,
    initialFormState
  );

  // DELETE FORM STATE
  const delete_initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_deleteDashboardElement = deleteDashboardElement.bind(null, {
    id,
    dashboardId,
  });
  const [delete_formState, delete_formAction] = useFormState(
    bound_deleteDashboardElement,
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
          <MixerHorizontalIcon className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>Elementi düzenleyin</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 pt-4'>
          <form action={formAction} className='flex flex-col gap-6'>
            <div className=''>
              <Label htmlFor='name'>İsim</Label>
              <Input defaultValue={name} ref={nameRef} id='name' name='name' />
            </div>
            <div className='flex flex-col gap-1'>
              <Label>Kolonlar</Label>
              <input
                value={JSON.stringify(fields)}
                hidden
                readOnly
                name='fields'
              />
              <div className='flex flex-col gap-8 p-4 pt-8 rounded-md border border-slate-200'>
                {fields.map((field, index) => {
                  return (
                    <div key={index} className='flex w-full items-center gap-4'>
                      <div className='w-full relative'>
                        <Label
                          className='absolute -top-4'
                          htmlFor={field.oldName}
                        >
                          {field.oldName}
                        </Label>
                        <Input
                          className=''
                          id={field.oldName}
                          value={field.newName}
                          onChange={(e) => {
                            setFields(
                              fields.map((item, i) =>
                                i === index
                                  ? {
                                      ...item,
                                      newName: e.target.value,
                                    }
                                  : item
                              )
                            );
                          }}
                        />
                      </div>
                      <Switch
                        checked={field.enabled}
                        onCheckedChange={(checked) => {
                          setFields(
                            fields.map((item, i) =>
                              i === index
                                ? {
                                    ...item,
                                    enabled: checked,
                                  }
                                : item
                            )
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className=''>
              <Label htmlFor='widht'>Genişlik</Label>
              <Input
                defaultValue={widht}
                ref={widhtRef}
                id='widht'
                name='widht'
                type='number'
                min={0}
                max={3}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <SubmitButton>Kaydet</SubmitButton>
              {showResponseMessage ? (
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
            </div>
          </form>

          <div className='bg-slate-50 p-4 font-semibold rounded-md flex flex-col gap-2'>
            <h3>Sorgu</h3>
            <div className='text-sm font-light italic text-slate-500'>
              {query}
            </div>
          </div>
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
