import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import Loading from '@/components/ui/Loading';

const SubjectChart = ({ studentId, className }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const generateSubjectData = () => {
      setLoading(true);
      
      // Generate subject performance data
      const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'PE'];
      const subjectScores = subjects.map(() => {
        return Math.floor(Math.random() * 30) + 70; // Random scores between 70-100
      });

      const chartOptions = {
        chart: {
          type: 'radar',
          height: 350,
          toolbar: {
            show: false
          },
          background: 'transparent'
        },
        title: {
          text: ''
        },
        xaxis: {
          categories: subjects,
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
          tickAmount: 5,
          labels: {
            formatter: (value) => `${value}%`,
            style: {
              fontSize: '10px',
              fontFamily: 'Inter, sans-serif'
            }
          }
        },
        fill: {
          opacity: 0.3
        },
        stroke: {
          width: 2
        },
        colors: ['#4A90E2'],
        markers: {
          size: 4,
          strokeWidth: 2,
          strokeColors: ['#4A90E2'],
          fillColors: ['#ffffff']
        },
        tooltip: {
          theme: 'light',
          y: {
            formatter: (value) => `${value}%`
          }
        },
        grid: {
          show: true
        }
      };

      const series = [{
        name: 'Performance',
        data: subjectScores
      }];

      setChartData({ options: chartOptions, series });
      setLoading(false);
    };

    // Simulate API call delay
    setTimeout(generateSubjectData, 300);
  }, [studentId, className]);

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
        type="radar"
        height="100%"
      />
    </div>
  );
};

export default SubjectChart;