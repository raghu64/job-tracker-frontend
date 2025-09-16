import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';

interface ChartProps {
  type: 'bar' | 'pie' | 'line';
  data: any;
  options: any;
  height?: string;
}

const ReportChart: React.FC<ChartProps> = ({ type, data, options, height = "h-64" }) => {
  if (!data) return <div className="text-gray-500">No data available</div>;

  return (
    <div className={height}>
      {type === 'bar' && <Bar data={data} options={options} />}
      {type === 'pie' && <Pie data={data} options={options} />}
      {type === 'line' && <Line data={data} options={options} />}
    </div>
  );
};

export default ReportChart;
