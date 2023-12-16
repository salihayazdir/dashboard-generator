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
  CrossCircledIcon,
  ListBulletIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { Textarea } from '../ui/textarea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';
import React from 'react';
import { addElementToDashboard } from '@/actions/addElementToDashboard';
import LoadingDots from '../placeholder/LoadingDots';
import { Skeleton } from '../ui/skeleton';
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

type Props = {
  dashboardId: number;
};

export default function AddElement({ dashboardId }: Props) {
  const [originalData, setOriginalData] = useState<{
    result: any[];
    query: string;
  }>({ result: [], query: '' });

  const [elementData, setElementData] = useState<any[]>([]);
  const [elementType, setElementType] = useState<'table' | 'bar' | 'line'>(
    'table'
  );

  const [fields, setFields] = useState<
    {
      enabled: boolean;
      newName: string;
      oldName: string;
    }[]
  >([]);

  const bound_addElementToDashboard = addElementToDashboard.bind(
    null,
    dashboardId
  );

  const [dataIsLoading, setDataIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<undefined | string>(
    undefined
  );

  const generateElement = async () => {
    const prompt = promptRef.current?.value;

    setErrorMessage(undefined);
    setOriginalData({ result: [], query: '' });
    setDataIsLoading(true);
    setFields([]);
    await axios
      .post(`/api/mock-prompt-to-data`, {
        prompt,
        dataSourceId: 1, // TODO
      })
      .then((res) => {
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='w-4 h-4 mr-2' />
          <span>Element Ekle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='w-auto max-w-none'>
        <DialogHeader>
          <DialogTitle>Element Ekle</DialogTitle>
          <DialogDescription>Dashboard'a bir element ekleyin</DialogDescription>
        </DialogHeader>

        <div className='flex gap-8 mt-4 divide-x divide-slate-200'>
          <div className='min-w-[320px] flex flex-col gap-4'>
            <div className=''>
              <Label htmlFor='prompt'>Açıklama</Label>
              <Textarea
                ref={promptRef}
                disabled={dataIsLoading}
                id='prompt'
                rows={4}
              />
            </div>
            <Button disabled={dataIsLoading} onClick={generateElement}>
              {dataIsLoading ? (
                <LoadingDots color='white' />
              ) : (
                <>
                  Oluştur
                  <ArrowRightIcon className='w-4 h-4 ml-4' />
                </>
              )}
            </Button>
          </div>

          <div className='relative flex flex-col gap-4 pl-8'>
            <ScrollArea
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
                  <span>{errorMessage}</span>
                </div>
              ) : null}
              {elementData.length === 0 ? (
                <div>
                  <div className='flex items-end w-full gap-3'>
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[300px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[280px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[210px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[270px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[230px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[250px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                    <Skeleton
                      className={cn(
                        'w-1/4 h-[280px] flex-1',
                        !dataIsLoading && 'animate-none'
                      )}
                    />
                  </div>
                </div>
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
                <form action={bound_addElementToDashboard}>
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
                  <div className='flex w-full gap-4 pl-2 pr-4'>
                    <Input
                      name='name'
                      required
                      placeholder='Elemente bir isim verin.'
                    />
                    <Button type='submit'>Dashboard'a Ekle</Button>
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
