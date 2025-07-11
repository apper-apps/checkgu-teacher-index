import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Loading from '@/components/ui/Loading';

const PerformanceChart = ({ studentId, overallGrade, attendanceRate }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generatePerformanceData = () => {
      setLoading(true);
      
      // Convert grade to numerical value for chart
      const gradeToNumber = (grade) => {
        const gradeMap = {
          'A+': 97, 'A': 93, 'A-': 90,
          'B+': 87, 'B': 83, 'B-': 80,
          'C+': 77, 'C': 73, 'C-': 70,
          'D+': 67, 'D': 63, 'D-': 60,
          'F': 50
        };
        return gradeMap[grade] || 83;
      };

      const performanceScore = gradeToNumber(overallGrade);
      
      // Generate performance metrics
      const metrics = [
        { name: 'Attendance', value: attendanceRate, color: '#4A90E2' },
        { name: 'Academic Performance', value: performanceScore, color: '#7ED321' },
        { name: 'Participation', value: Math.max(70, Math.min(100, performanceScore + Math.random() * 10 - 5)), color: '#F5A623' },
        { name: 'Homework Completion', value: Math.max(75, Math.min(100, attendanceRate + Math.random() * 10 - 5)), color: '#D0021B' }
      ];

      const chartOptions = {
        chart: {
          type: 'radialBar',
          height: 350,
          toolbar: {
            show: false
          },
          background: 'transparent'
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: false,
              },
              value: {
                show: false,
              }
            }
          }
        },
        colors: metrics.map(m => m.color),
        labels: metrics.map(m => m.name),
        legend: {
          show: true,
          floating: true,
          fontSize: '12px',
          fontFamily: 'Inter, sans-serif',
          position: 'left',
          offsetX: 10,
          offsetY: 10,
          labels: {
            useSeriesColors: true,
          },
          markers: {
            size: 0
          },
          formatter: function(seriesName, opts) {
            return seriesName + ": " + opts.w.globals.series[opts.seriesIndex] + "%"
          },
          itemMargin: {
            vertical: 3
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }]
      };

      const series = metrics.map(m => Math.round(m.value));

      setChartData({ options: chartOptions, series });
      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generatePerformanceData, 300);
  }, [studentId, overallGrade, attendanceRate]);

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
        type="radialBar"
        height="100%"
      />
    </div>
  );
};

export default PerformanceChart;