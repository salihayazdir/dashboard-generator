'use client';
import DashboardBarChart from './DashboardBarChart';
import DashboardLineChart from './DashboardLineChart';
import DashboardTable from './DashboardTable';

export default function ElementVisualisation({ type, data }: any) {
  if (type === 'bar') {
    return <DashboardBarChart data={data} />;
  } else if (type === 'line') {
    return <DashboardLineChart data={data} />;
  } else {
    return <DashboardTable data={data} />;
  }
}
