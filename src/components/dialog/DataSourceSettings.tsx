'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
import { Label } from '../ui/label';
import React, { useEffect, useState } from 'react';
import { cn, isJsonString } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../SubmitButton';
import useTestDbConnection from '../TestDbConnection';
import { DataSource } from '@prisma/client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import useUpdateDbSchema from '../UpdateDbSchema';
import { editDataSource } from '@/actions/editDataSource';
import { deleteDataSource } from '@/actions/deleteDataSource';

type Props = {
  dataSource: DataSource;
};
export default function DataSourceSettings({ dataSource }: Props) {
  const [open, setOpen] = useState(false);

  const { TestDbConnectionButton, connectionTest, setConnectionTest } =
    useTestDbConnection({ initialString: dataSource.connectionString });

  const { UpdateDbSchemaButton, dbSchemaState, setDbSchemaState } =
    useUpdateDbSchema({ dataSource });

  const dataBaseSchema: {
    table_name: string;
    column_name: string;
    data_type: string;
  }[] =
    dataSource.schema && isJsonString(dataSource.schema)
      ? JSON.parse(dataSource.schema)
      : null;

  // UPDATE FORM STATE
  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_editDataSource = editDataSource.bind(null, dataSource);
  const [formState, formAction] = useFormState(
    bound_editDataSource,
    initialFormState
  );

  // DELETE FORM STATE
  const delete_initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_deleteDataSource = deleteDataSource.bind(null, dataSource.id);
  const [delete_formState, delete_formAction] = useFormState(
    bound_deleteDataSource,
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
    <>
      <Dialog
        onOpenChange={(open) => {
          setOpen(open);
          setShowDeleteButton(false);
          setShowResponseMessage(false);
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button variant='ghost' size='icon'>
            <MixerHorizontalIcon className='w-4 h-4' />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[450px]'>
          <DialogHeader>
            <DialogTitle>Veri Kaynağını Düzenle</DialogTitle>
            <DialogDescription>
              Veri kaynağının ismini, bağlantı adresini ve şemasını düzenleyin.
            </DialogDescription>
          </DialogHeader>
          <div className='flex flex-col gap-4'>
            <form action={formAction} className='flex flex-col gap-8'>
              <div>
                <Label htmlFor='name'>İsim</Label>
                <Input
                  required
                  minLength={3}
                  id='name'
                  name='name'
                  defaultValue={dataSource.name}
                />
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

              <div className='flex flex-col gap-2'>
                <Label>Veri Tabanı Şeması</Label>
                {dataBaseSchema ? (
                  <Accordion
                    type='multiple'
                    className='w-full border border-slate-200 rounded-md px-4 pt-1'
                  >
                    {[
                      ...new Set(
                        dataBaseSchema?.map((column) => column.table_name)
                      ),
                    ].map((table, i) => (
                      <AccordionItem key={`${table}_${i}`} value={table}>
                        <AccordionTrigger className='py-2'>
                          {table}
                        </AccordionTrigger>
                        <AccordionContent className='text-xs pt-1 text-slate-700 flex flex-col gap-2'>
                          {dataBaseSchema
                            .filter((column) => column.table_name === table)
                            .map((column, i) => (
                              <div
                                key={`${column}_${table}_${i}`}
                                className='flex items-center'
                              >
                                {`${column.column_name}`}
                                <span className='bg-slate-100 rounded-md tracking-tight text-slate-500 semibold px-2 py-0.5 ml-2'>
                                  {column.data_type}
                                </span>
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : null}
                <UpdateDbSchemaButton />
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
    </>
  );
}
