import { LineChart } from '@tremor/react';

type Props = {
  data: Record<string, unknown>[];
};

const valueFormatter = (number: number) =>
  `${new Intl.NumberFormat('us').format(number).toString()}`;

export default function DashboardLineChart({ data }: Props) {
  const categories = data.reduce((acc, item) => {
    Object.keys(item).forEach((key) => {
      if (!isNaN(Number(item[key])) && !acc.includes(key)) {
        acc.push(key);
      }
    });
    return acc;
  }, [] as string[]);

  const maxValue = Math.max(
    ...data
      .map((item) => {
        return categories.map((category: string) =>
          parseFloat(item[category] as string)
        );
      })
      .flat()
  );

  return (
    <LineChart
      className=''
      data={data}
      index={Object.keys(data[0])[0]}
      categories={categories}
      colors={['blue']}
      valueFormatter={valueFormatter}
      yAxisWidth={48}
      maxValue={maxValue}
    />
  );
}
