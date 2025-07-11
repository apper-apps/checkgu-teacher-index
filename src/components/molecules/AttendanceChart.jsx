import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Loading from '@/components/ui/Loading';

const AttendanceChart = ({ studentId, attendanceRate }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generateAttendanceData = () => {
      setLoading(true);
      
      // Generate mock monthly attendance data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      const displayMonths = months.slice(0, currentMonth + 1);
      
      // Generate attendance data with some variation around the actual rate
      const attendanceData = displayMonths.map((month, index) => {
        const baseRate = attendanceRate;
        const variation = Math.random() * 10 - 5; // ±5% variation
        return Math.max(0, Math.min(100, Math.round(baseRate + variation)));
      });

      const chartOptions = {
        chart: {
          type: 'area',
          height: 350,
          toolbar: {
            show: false
          },
          background: 'transparent'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#4A90E2'],
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        xaxis: {
          categories: displayMonths,
          labels: {
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            formatter: (value) => `${value}%`,
            style: {
              fontSize: '12px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        grid: {
          borderColor: '#e7e7e7',
          strokeDashArray: 2
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => `${value}%`
          }
        }
      };

      const series = [{
        name: 'Attendance Rate',
        data: attendanceData
      }];

      setChartData({ options: chartOptions, series });
      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateAttendanceData, 300);
  }, [studentId, attendanceRate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="area"
        height="100%"
      />
    </div>
  );
};

export default AttendanceChart;