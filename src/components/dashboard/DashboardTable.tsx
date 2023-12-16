import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  data: Record<string, unknown>[];
};

export default function DashboardTable({ data }: Props) {
  const headers = Object.keys(data[0]);
  return (
    <Table className=''>
      <TableHeader>
        <TableRow>
          {headers.map((header: string) => (
            <TableHead className='py-1.5 px-3' key={header}>
              {header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item: any, index: number) => (
          <TableRow key={`${item.name}-${index}`}>
            {headers.map((header: string, index: number) => {
              return (
                <TableCell className='py-1.5 px-3 ' key={`${header}-${index}`}>
                  {item[header]}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
