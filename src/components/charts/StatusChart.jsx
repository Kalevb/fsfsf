// กราฟวงกลมแสดงสัดส่วนสถานะคดี (StatusChart) ด้วย react-chartjs-2
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusChart({ cases = [] }) {
  const counts = {
    pending: 0,
    investigating: 0,
    evidence_review: 0,
    closed: 0,
    rejected: 0
  };

  cases.forEach((c) => {
    if (counts[c.status] !== undefined) {
      counts[c.status] += 1;
    }
  });

  const data = {
    labels: [
      'รอรับเรื่อง',
      'กำลังสืบสวน',
      'ตรวจหลักฐาน',
      'คลี่คลาย/ปิดคดี',
      'ไม่รับคำร้อง'
    ],
    datasets: [
      {
        data: [
          counts.pending,
          counts.investigating,
          counts.evidence_review,
          counts.closed,
          counts.rejected
        ],
        backgroundColor: ['#F59E0B', '#2563EB', '#7C3AED', '#16A34A', '#DC2626'],
        borderWidth: 2,
        borderColor: '#FFFFFF'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: 'Kanit', size: 12 },
          padding: 14
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
}
