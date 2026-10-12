// กราฟแท่งเปรียบเทียบจำนวนคดีตามประเภทภัยออนไลน์ (CaseTypeChart)
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CaseTypeChart({ cases = [] }) {
  const counts = {
    call_center: 0,
    investment: 0,
    online_shopping: 0
  };

  cases.forEach((c) => {
    if (counts[c.caseType] !== undefined) {
      counts[c.caseType] += 1;
    }
  });

  const data = {
    labels: ['Call Center Scam', 'Investment Scam', 'Online Shopping'],
    datasets: [
      {
        label: 'จำนวนคดี (เรื่อง)',
        data: [counts.call_center, counts.investment, counts.online_shopping],
        backgroundColor: ['#1E3A8A', '#2563EB', '#60A5FA'],
        borderRadius: 10
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1, font: { family: 'Kanit' } }
      },
      x: {
        ticks: { font: { family: 'Kanit', size: 12 } }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
