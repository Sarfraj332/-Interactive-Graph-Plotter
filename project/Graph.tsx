import React, { useRef, useState, useMemo } from 'react';
import {
  Line,
  Bar,
  Scatter,
  Pie,
  Doughnut,
  Radar,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
} from 'chart.js';
import * as math from 'mathjs';
import { GraphControls } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Props {
  controls: GraphControls;
}

const colors = [
  'rgba(0, 255, 255, 0.8)',
  'rgba(255, 99, 132, 0.8)',
  'rgba(255, 206, 86, 0.8)',
  'rgba(75, 192, 192, 0.8)',
  'rgba(153, 102, 255, 0.8)',
  'rgba(255, 159, 64, 0.8)',
];

export function Graph({ controls }: Props) {
  const chartRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  const parseData = (data: string): number[] => {
    try {
      return data.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val));
    } catch {
      return [];
    }
  };

  const { points, labels, scatterData } = useMemo(() => {
    const defaultResult = { points: [], labels: [], scatterData: [] };
    
    try {
      if (!['line', 'area', 'scatter', 'bubble', 'step'].includes(controls.type)) {
        const data = parseData(controls.data || '');
        if (data.length === 0) {
          setError('Please enter valid comma-separated numbers');
          return defaultResult;
        }
        setError(null);
        return {
          points: data,
          labels: data.map((_, i) => `Value ${i + 1}`),
          scatterData: data.map((y, x) => ({ x, y }))
        };
      }

      const expr = controls.equation.toLowerCase().trim();
      
      if (!expr) {
        setError('Please enter an equation');
        return defaultResult;
      }

      try {
        // Test if the expression is valid
        math.evaluate(expr, { x: 1 });
      } catch {
        setError('Invalid equation format');
        return defaultResult;
      }

      const points: number[] = [];
      const labels: string[] = [];
      const scatterData: { x: number; y: number }[] = [];

      for (let x = controls.xMin; x <= controls.xMax; x += controls.step) {
        try {
          const y = math.evaluate(expr, { x });
          if (!isNaN(y) && isFinite(y)) {
            points.push(y);
            labels.push(x.toFixed(1));
            scatterData.push({ x, y });
          }
        } catch {
          continue;
        }
      }

      if (points.length === 0) {
        setError('No valid points generated');
        return defaultResult;
      }

      setError(null);
      return { points, labels, scatterData };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generating graph');
      return defaultResult;
    }
  }, [controls.type, controls.equation, controls.data, controls.xMin, controls.xMax, controls.step]);

  const chartData: ChartData<any> = useMemo(() => {
    switch (controls.type) {
      case 'line':
      case 'area':
      case 'step':
        return {
          labels,
          datasets: [{
            label: controls.equation || 'Values',
            data: points,
            borderColor: '#0ff',
            backgroundColor: controls.type === 'area' ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
            borderWidth: 2,
            tension: controls.type === 'step' ? 0 : 0.4,
            fill: controls.type === 'area',
            stepped: controls.type === 'step',
            hoverBackgroundColor: 'rgba(0, 255, 255, 0.2)',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 3,
          }],
        };

      case 'bar':
      case 'histogram':
        return {
          labels,
          datasets: [{
            label: 'Values',
            data: points,
            backgroundColor: colors,
            borderColor: '#0ff',
            borderWidth: 1,
            barPercentage: controls.type === 'histogram' ? 1.0 : 0.8,
            categoryPercentage: controls.type === 'histogram' ? 1.0 : 0.8,
            hoverBackgroundColor: colors.map(color => color.replace('0.8', '1')),
            hoverBorderColor: '#fff',
            hoverBorderWidth: 2,
          }],
        };

      case 'scatter':
      case 'bubble':
        return {
          datasets: [{
            label: controls.equation || 'Values',
            data: scatterData.map(point => ({
              x: point.x,
              y: point.y,
              r: controls.type === 'bubble' ? Math.min(Math.abs(point.y) * 2, 20) : 4,
            })),
            backgroundColor: 'rgba(0, 255, 255, 0.6)',
            borderColor: '#0ff',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(0, 255, 255, 1)',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 2,
            hoverRadius: controls.type === 'bubble' ? undefined : 8,
          }],
        };

      case 'pie':
      case 'doughnut':
      case 'polar':
        return {
          labels,
          datasets: [{
            data: points,
            backgroundColor: colors,
            borderColor: '#1a1b26',
            borderWidth: 2,
            hoverBackgroundColor: colors.map(color => color.replace('0.8', '1')),
            hoverBorderColor: '#fff',
            hoverBorderWidth: 3,
          }],
        };

      case 'radar':
        return {
          labels,
          datasets: [{
            label: 'Values',
            data: points,
            backgroundColor: 'rgba(0, 255, 255, 0.2)',
            borderColor: '#0ff',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(0, 255, 255, 0.3)',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 3,
          }],
        };

      default:
        return {
          labels,
          datasets: [{
            label: 'Values',
            data: points,
            borderColor: '#0ff',
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(0, 255, 255, 0.2)',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 3,
          }],
        };
    }
  }, [points, labels, scatterData, controls.type, controls.equation]);

  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          labels: {
            color: '#fff',
            font: {
              size: 12,
            },
            usePointStyle: true,
            pointStyle: 'circle',
          },
          onHover: (event: any, legendItem: any, legend: any) => {
            document.body.style.cursor = 'pointer';
          },
          onLeave: (event: any, legendItem: any, legend: any) => {
            document.body.style.cursor = 'default';
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#0ff',
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          usePointStyle: true,
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== undefined) {
                label += context.parsed.y.toFixed(2);
              }
              return label;
            }
          }
        },
      },
      animation: {
        duration: 750,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
        animationDuration: 150,
      },
      onHover: (event: any, elements: any) => {
        event.native.target.style.cursor = elements.length ? 'pointer' : 'default';
      },
    };

    if (['pie', 'doughnut', 'radar', 'polar'].includes(controls.type)) {
      return baseOptions;
    }

    return {
      ...baseOptions,
      scales: {
        x: {
          type: ['scatter', 'bubble'].includes(controls.type) ? 'linear' : 'category',
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#fff',
          },
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: '#fff',
          },
        },
      },
    };
  }, [controls.type]);

  const renderChart = () => {
    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-red-400 text-center">
            <p className="text-xl mb-2">⚠️ Error</p>
            <p>{error}</p>
          </div>
        </div>
      );
    }

    const props = {
      data: chartData,
      options: chartOptions,
      ref: chartRef,
    };

    switch (controls.type) {
      case 'line':
      case 'area':
      case 'step':
        return <Line {...props} />;
      case 'bar':
      case 'histogram':
        return <Bar {...props} />;
      case 'scatter':
      case 'bubble':
        return <Scatter {...props} />;
      case 'pie':
        return <Pie {...props} />;
      case 'doughnut':
        return <Doughnut {...props} />;
      case 'radar':
      case 'polar':
        return <Radar {...props} />;
      default:
        return <Line {...props} />;
    }
  };

  return (
    <div className="w-full h-[600px] bg-[#1f2937] rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
      <div className="w-full h-full">
        {renderChart()}
      </div>
    </div>
  );
}