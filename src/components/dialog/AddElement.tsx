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
import {
  ArrowRightIcon,
  CircleBackslashIcon,
  CrossCircledIcon,
  ListBulletIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import React from 'react';
import { addElementToDashboard } from '@/actions/addElementToDashboard';
import LoadingDots from '../placeholder/LoadingDots';
import { cn } from '@/lib/utils';
import DashboardTable from '../dashboard/DashboardTable';
import DashboardBarChart from '../dashboard/DashboardBarChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import DashboardLineChart from '../dashboard/DashboardLineChart';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Switch } from '../ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { useFormState } from 'react-dom';
import { SubmitButton } from '../SubmitButton';
import ElementPlaceholder from '../placeholder/ElementPlaceholder';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

type Props = {
  dashboardId: number;
  dataSourceId: number;
} & ButtonProps;

export default function AddElement({
  dashboardId,
  dataSourceId,
  ...props
}: Props) {
  const [originalData, setOriginalData] = useState<{
    result: any[];
    query: string;
  }>({ result: [], query: '' });

  const [elementData, setElementData] = useState<any[]>([]);
  const [elementType, setElementType] = useState<'table' | 'bar' | 'line'>(
    'table'
  );

  const [chatMessages, setChatMessages] = useState<
    {
      role: 'user' | 'assistant';
      message: string;
      query: string;
    }[]
  >([]);

  const [fields, setFields] = useState<
    {
      enabled: boolean;
      newName: string;
      oldName: string;
    }[]
  >([]);

  // ADD ELEMENT TO DASHBOARD - FORM ACTION //
  const initialFormState = {
    success: false,
    tried: false,
    message: null,
  };
  const bound_addElementToDashboard = addElementToDashboard.bind(
    null,
    dashboardId
  );
  const [addElementToDashboard_formState, addElementToDashboard_formAction] =
    useFormState(bound_addElementToDashboard, initialFormState);
  const handleAddElementToDashboard_formAction = (formData: FormData) => {
    addElementToDashboard_formAction(formData);
  };

  const [showResponseMessage, setShowResponseMessage] = useState(false);
  useEffect(() => {
    if (addElementToDashboard_formState?.loading) setShowResponseMessage(false);
    if (addElementToDashboard_formState?.tried) setShowResponseMessage(true);
  }, [addElementToDashboard_formState]);

  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  );

  const handleReset = () => {
    setOriginalData({ result: [], query: '' });
    setElementData([]);
    setElementType('table');
    setChatMessages([]);
    setFields([]);
    setDataIsLoading(false);
    setErrorMessage(undefined);
  };

  const generateElement = async () => {
    const prompt = promptRef.current?.value;

    setErrorMessage(undefined);
    setOriginalData({ result: [], query: '' });
    setDataIsLoading(true);
    setFields([]);

    await axios
      .post(`/api/prompt-to-data`, {
        prompt,
        dataSourceId,
        previousMessages: chatMessages,
      })
      .then((res) => {
        setChatMessages((prev) => [
          ...prev,
          { role: 'user', message: `${prompt}`, query: '' },
          {
            role: 'assistant',
            message: res.data?.message,
            query: res.data?.query,
          },
        ]);
        if (elementNameRef.current) {
          elementNameRef.current.value = res.data?.title;
        }
        if (promptRef.current) {
          promptRef.current.value = '';
        }
        setOriginalData({
          result: res.data?.result,
          query: res.data?.query,
        });
        setFields(
          res.data?.result[0]
            ? Object.keys(res.data?.result[0]).map((key) => ({
                enabled: true,
                newName: key,
                oldName: key,
              }))
            : []
        );
        setDataIsLoading(false);
      })
      .catch((err) => {
        setOriginalData({ result: [], query: err.response.data?.query });
        setErrorMessage(err.response.data?.error);
        setDataIsLoading(false);
      });
  };

  const updateFields = () => {
    setElementData(
      originalData.result.map((item) => {
        const newItem: Record<string, unknown> = {};
        fields.forEach((field) => {
          if (field.enabled) {
            newItem[field.newName] = item[field.oldName];
          }
        });
        return newItem;
      })
    );
  };

  useEffect(() => {
    setElementData(originalData.result);
  }, [originalData]);

  const promptRef = React.useRef<HTMLTextAreaElement>(null);
  const elementNameRef = React.useRef<HTMLInputElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button {...props}>
          {props.children ? (
            props.children
          ) : (
            <>
              <PlusIcon className='w-4 h-4 mr-2 text-yesil' />
              <span>Element Ekle</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className='w-auto max-w-none -mt-10'>
        <DialogHeader className='flex'>
          <DialogTitle>Element Ekle</DialogTitle>
          <DialogDescription>{`Dashboard'a bir element ekleyin`}</DialogDescription>
          <Button
            onClick={handleReset}
            className='absolute text-gray-500 top-2 right-12 hover:text-red-600'
            variant='outline'
            size='sm'
          >
            <CircleBackslashIcon className='h-3 w-3 mr-2' />
            Baştan Başla
          </Button>
        </DialogHeader>

        <div className='flex gap-8 mt-4 divide-x divide-slate-200'>
          <div className='min-w-[400px] flex flex-col gap-4 justify-between'>
            {chatMessages.length > 0 ? (
              <>
                <ScrollAreaPrimitive.Root
                  type='always'
                  className={cn('relative overflow-hidden')}
                >
                  <ScrollAreaPrimitive.Viewport className='h-[380px] w-full rounded-[inherit]'>
                    <div className=' flex flex-col-reverse justify-end gap-2'>
                      {chatMessages
                        .slice()
                        .reverse()
                        .map((message, index) => (
                          <div
                            key={index}
                            className={cn('flex gap-4 ', {
                              'justify-start': message.role === 'user',
                              'justify-end': message.role === 'assistant',
                            })}
                          >
                            <div
                              className={cn('p-2 rounded-md w-[300px]', {
                                'bg-slate-50': message.role === 'user',
                                'bg-green-50': message.role === 'assistant',
                              })}
                            >
                              <p className='text-sm'>{message.message}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </ScrollAreaPrimitive.Viewport>
                  <ScrollBar />
                  <ScrollAreaPrimitive.Corner />
                </ScrollAreaPrimitive.Root>
              </>
            ) : null}
            <div className='flex flex-col gap-4'>
              <div>
                <Label
                  className={cn({ hidden: chatMessages.length > 0 })}
                  htmlFor='prompt'
                >
                  Açıklama
                </Label>
                <Textarea
                  ref={promptRef}
                  disabled={dataIsLoading}
                  id='prompt'
                  required
                  minLength={10}
                  placeholder={
                    chatMessages.length > 0 ? 'Bir düzenleme önerin.' : ''
                  }
                  rows={chatMessages.length > 0 ? 2 : 4}
                />
              </div>
              <Button disabled={dataIsLoading} onClick={generateElement}>
                {dataIsLoading ? (
                  <LoadingDots color='white' />
                ) : (
                  <>
                    {chatMessages.length > 0 ? 'Gönder' : 'Oluştur'}
                    <ArrowRightIcon className='w-4 h-4 ml-4' />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className='relative flex flex-col gap-4 pl-8'>
            <ScrollArea
              type='always'
              className={cn('min-w-[520px] rounded-lg px-2', {
                'max-h-[420px]': elementData.length > 0,
              })}
            >
              {elementData.length > 0 ? (
                <Tabs
                  onValueChange={(value) =>
                    setElementType(value as 'table' | 'bar' | 'line')
                  }
                  defaultValue='table'
                  className='mr-2'
                >
                  <div className='flex justify-between gap-2'>
                    <TabsList className='grid w-full grid-cols-3'>
                      <TabsTrigger value='table'>Tablo</TabsTrigger>
                      <TabsTrigger value='bar'>Bar</TabsTrigger>
                      <TabsTrigger value='line'>Çizgi</TabsTrigger>
                    </TabsList>
                    <Popover>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <PopoverTrigger asChild>
                            <TooltipTrigger asChild>
                              <Button variant='outline' size={'icon'}>
                                <ListBulletIcon className='h-4 w-4' />
                                <TooltipContent>
                                  <p>Kolonları Düzenle</p>
                                </TooltipContent>
                              </Button>
                            </TooltipTrigger>
                          </PopoverTrigger>
                        </Tooltip>
                      </TooltipProvider>
                      <PopoverContent align='end' className='w-80'>
                        <div className='grid gap-4'>
                          <div className='space-y-2'>
                            <h4 className='font-medium leading-none'>
                              Kolonlar
                            </h4>
                            <p className='text-sm text-muted-foreground'>
                              Kollon isimlerini ve görünürlüğünü düzenleyin.
                            </p>
                          </div>
                          <div className='flex flex-col gap-8 pt-4'>
                            {fields.map((field, index) => {
                              return (
                                <div
                                  key={index}
                                  className='flex w-full items-center gap-4'
                                >
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
                          <Button onClick={updateFields}>Güncelle</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className='border mt-2 px-2 rounded-md border-slate-200'>
                    <TabsContent value='table'>
                      <DashboardTable data={elementData} />
                    </TabsContent>
                    <TabsContent value='bar'>
                      <DashboardBarChart data={elementData} />
                    </TabsContent>
                    <TabsContent value='line'>
                      <DashboardLineChart data={elementData} />
                    </TabsContent>
                  </div>
                </Tabs>
              ) : null}
              {errorMessage ? (
                <div className='absolute flex items-center gap-4 p-2 text-sm leading-4 transform -translate-x-1/2 -translate-y-1/2 bg-opacity-50 rounded-md text-rose-700 bg-rose-100 top-1/2 left-1/2'>
                  <CrossCircledIcon className='w-10 h-10' />
                  <span>{JSON.stringify(errorMessage).toString()}</span>
                </div>
              ) : null}
              {elementData.length === 0 ? (
                <ElementPlaceholder loading={dataIsLoading} />
              ) : null}
            </ScrollArea>

            {elementData.length > 0 ? (
              <>
                <div className='pl-2 pr-4'>
                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem
                      className='border px-4 rounded-md'
                      value='item-1'
                    >
                      <AccordionTrigger className='py-2'>
                        Sorgu
                      </AccordionTrigger>
                      <AccordionContent className='text-sm font-light italic text-slate-500'>
                        {originalData.query.toString()}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <form action={handleAddElementToDashboard_formAction}>
                  <input
                    name='query'
                    readOnly
                    hidden
                    value={originalData.query.toString()}
                  />
                  <input
                    name='fields'
                    readOnly
                    hidden
                    value={JSON.stringify(fields)}
                  />
                  <input
                    name='type'
                    readOnly
                    hidden
                    value={elementType.toString()}
                  />
                  <div className='flex flex-col gap-2 pr-4 pl-2'>
                    <div className='flex w-full gap-4'>
                      <Input
                        name='name'
                        ref={elementNameRef}
                        required
                        placeholder='Elemente bir isim verin.'
                      />
                      <SubmitButton className='w-40'>{`Dashboard'a Ekle`}</SubmitButton>
                    </div>
                    {showResponseMessage ? (
                      <div
                        className={cn(
                          'flex items-center bg-slate-50 justify-center text-sm rounded-md py-2 px-4',
                          {
                            'text-red-700':
                              !addElementToDashboard_formState.success,
                            'bg-red-50':
                              !addElementToDashboard_formState.success,
                            'text-green-700':
                              addElementToDashboard_formState.success,
                            'bg-green-50':
                              addElementToDashboard_formState.success,
                          }
                        )}
                      >
                        {addElementToDashboard_formState.message}
                      </div>
                    ) : null}
                  </div>
                </form>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
