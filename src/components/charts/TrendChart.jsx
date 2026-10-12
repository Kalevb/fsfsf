// กราฟเส้นแสดงแนวโน้มมูลค่าความเสียหายรายเดือน (TrendChart)
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function TrendChart({ cases = [] }) {
  const monthLabels = ['ก.ค. 69', 'ส.ค. 69', 'ก.ย. 69', 'ต.ค. 69'];
  const damageByMonth = [0, 0, 0, 0];

  cases.forEach((c) => {
    const d = c.incidentDate || '';
    const amount = Number(c.damageAmount) || 0;
    if (d.startsWith('2026-07')) damageByMonth[0] += amount;
    else if (d.startsWith('2026-08')) damageByMonth[1] += amount;
    else if (d.startsWith('2026-09')) damageByMonth[2] += amount;
    else damageByMonth[3] += amount;
  });

  const data = {
    labels: monthLabels,
    datasets: [
      {
        label: 'มูลค่าความเสียหายรวม (บาท)',
        data: damageByMonth,
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: '#1E3A8A'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { family: 'Kanit', size: 12 } }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { family: 'Kanit' } }
      },
      x: {
        ticks: { font: { family: 'Kanit' } }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
