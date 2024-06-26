// components/LiveChart.tsx
import React, { useEffect, useRef } from 'react';
import { Line,  } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend, TimeScale, Filler);

interface LiveChartProps {
  data: number[];
}

const LiveChart: React.FC<LiveChartProps> = ({ data }) => {
  const chartRef = useRef<ChartJS | null>(null);

  const chartData = {
    labels: data.map((_, index) => new Date(Date.now() - (data.length - 1 - index) * 10000)),
    datasets: [
      {
        label: 'Concentration',
        data,
        // borderColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(173, 216, 230, 1)',
        // backgroundColor: 'rgba(75, 192, 192, 0.2)',
        backgroundColor: 'rgba(75, 192, 192, 0)',
        fill: true,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Add this to maintain the aspect ratio of the chart
    plugins: {
      legend: {
        labels: {
          color: 'white', 
        },
        position: 'bottom',
      },
      title: {
        display: false,
        text: 'Live Concentration Metrics',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', 
        },
        title: {
          color: 'white',
          display: true,
          text: 'Time',
        },
        type: 'time',
        time: {
          unit: 'second',
          stepSize: 10,
          displayFormats: {
            second: 'mm:ss', // Format for displaying time
          },
        },
      },
      y: {
        ticks: {
          display: false,
          text: 'Concentration',
          color: 'white',
        },
        suggestedMin: 0,
        suggestedMax: 1,
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data]);

  return (
    <div className="chart-  ">
      <Line ref={chartRef} data={chartData} options={chartOptions} />
    </div>
  );
};

export default LiveChart;
