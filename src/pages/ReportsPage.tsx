import React, { useState } from "react";
import { useLoading } from "../contexts/LoadingContext";
import api from "../api/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartData,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

type Duration = "today" | "week" | "month" | "custom";
type ViewMode = "text" | "graph";
type GraphType = "bar" | "pie" | "line" | "doughnut";
type ColorScheme = "default" | "warm" | "cool" | "pastel" | "vibrant";

interface ReportData {
  totalJobs: number;
  totalCalls: number;
  jobsByMarketingTeam: { [key: string]: number };
  callsByMarketingTeam: { [key: string]: number };
  dateRange: {
    from: string;
    to: string;
  };
}

export default function ReportsPage() {
  const [duration, setDuration] = useState<Duration>("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("text");
  const [graphType, setGraphType] = useState<GraphType>("bar");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("default");
  const [showLegend, setShowLegend] = useState(false);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [chartHeight, setChartHeight] = useState("384");
  const [animationDuration, setAnimationDuration] = useState(1000);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  console.log("User Time Zone: ", timeZone);
  
  const { setLoading } = useLoading();

  // Color schemes
  const colorSchemes = {
    default: [
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(199, 199, 199, 0.8)',
      'rgba(83, 102, 255, 0.8)',
    ],
    warm: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(255, 99, 71, 0.8)',
      'rgba(255, 140, 0, 0.8)',
      'rgba(220, 20, 60, 0.8)',
      'rgba(255, 69, 0, 0.8)',
      'rgba(255, 215, 0, 0.8)',
    ],
    cool: [
      'rgba(54, 162, 235, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(100, 149, 237, 0.8)',
      'rgba(123, 104, 238, 0.8)',
      'rgba(70, 130, 180, 0.8)',
      'rgba(95, 158, 160, 0.8)',
      'rgba(106, 90, 205, 0.8)',
    ],
    pastel: [
      'rgba(255, 182, 193, 0.8)',
      'rgba(221, 160, 221, 0.8)',
      'rgba(173, 216, 230, 0.8)',
      'rgba(152, 251, 152, 0.8)',
      'rgba(255, 218, 185, 0.8)',
      'rgba(250, 235, 215, 0.8)',
      'rgba(230, 230, 250, 0.8)',
      'rgba(255, 240, 245, 0.8)',
    ],
    vibrant: [
      'rgba(255, 0, 255, 0.8)',
      'rgba(0, 255, 255, 0.8)',
      'rgba(255, 255, 0, 0.8)',
      'rgba(255, 0, 0, 0.8)',
      'rgba(0, 255, 0, 0.8)',
      'rgba(0, 0, 255, 0.8)',
      'rgba(255, 165, 0, 0.8)',
      'rgba(128, 0, 128, 0.8)',
    ]
  };

  const handleDurationChange = (newDuration: Duration) => {
    setDuration(newDuration);
    if (newDuration !== "custom") {
      setFromDate("");
      setToDate("");
    }
  };

  const generateReport = async () => {
    setError("");
    setLoading(true);

    try {
      let params: any = { duration };
      
      if (duration === "custom") {
        if (!fromDate || !toDate) {
          setError("Please select both from and to dates for custom range");
          setLoading(false);
          return;
        }
        params = { duration: "custom", fromDate, toDate };
      }
      params = {...params, timeZone };

      const response = await api.get("/reports", { params });
      setReportData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Chart data functions
  const getJobsChartData = (): ChartData<'bar', number[], string> | null => {
    if (!reportData) return null;

    const labels = Object.keys(reportData.jobsByMarketingTeam);
    const data = Object.values(reportData.jobsByMarketingTeam);
    const colors = colorSchemes[colorScheme];

    return {
      labels,
      datasets: [
        {
          label: 'Jobs by Marketing Team',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '0.9')),
          hoverBorderWidth: 3,
        } as any,
      ],
    };
  };

  const getCallsChartData = (): ChartData<'bar', number[], string> | null => {
    if (!reportData) return null;

    const labels = Object.keys(reportData.callsByMarketingTeam);
    const data = Object.values(reportData.callsByMarketingTeam);
    const colors = colorSchemes[colorScheme];

    return {
      labels,
      datasets: [
        {
          label: 'Calls by Marketing Team',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '0.9')),
          hoverBorderWidth: 3,
        } as any,
      ],
    };
  };

  const getLineJobsChartData = (): ChartData<'line', number[], string> | null => {
    if (!reportData) return null;

    const labels = Object.keys(reportData.jobsByMarketingTeam);
    const data = Object.values(reportData.jobsByMarketingTeam);
    const colors = colorSchemes[colorScheme];

    return {
      labels,
      datasets: [
        {
          label: 'Jobs by Marketing Team',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          pointBackgroundColor: colors.slice(0, labels.length),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        } as any,
      ],
    };
  };

  const getLineCallsChartData = (): ChartData<'line', number[], string> | null => {
    if (!reportData) return null;

    const labels = Object.keys(reportData.callsByMarketingTeam);
    const data = Object.values(reportData.callsByMarketingTeam);
    const colors = colorSchemes[colorScheme];

    return {
      labels,
      datasets: [
        {
          label: 'Calls by Marketing Team',
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          pointBackgroundColor: colors.slice(0, labels.length),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        } as any,
      ],
    };
  };

  const getCombinedChartData = () => {
    if (!reportData) return null;

    const allTeams = Array.from(new Set([
      ...Object.keys(reportData.jobsByMarketingTeam),
      ...Object.keys(reportData.callsByMarketingTeam)
    ]));

    const jobsData = allTeams.map(team => reportData.jobsByMarketingTeam[team] || 0);
    const callsData = allTeams.map(team => reportData.callsByMarketingTeam[team] || 0);

    const baseDataset = {
      Jobs: {
        label: 'Jobs',
        data: jobsData,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)',
      },
      Calls: {
        label: 'Calls',
        data: callsData,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.9)',
      }
    };

    if (graphType === 'line') {
      return {
        labels: allTeams,
        datasets: [
          {
            ...baseDataset.Jobs,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
          } as any,
          {
            ...baseDataset.Calls,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
          } as any,
        ],
      };
    }

    return {
      labels: allTeams,
      datasets: [baseDataset.Jobs as any, baseDataset.Calls as any],
    };
  };

  // Fixed function to create pie/doughnut data with proper structure
  const getPieChartData = (data: { [key: string]: number }, type: 'jobs' | 'calls') => {
    const labels = Object.keys(data);
    const values = Object.values(data);
    const colors = colorSchemes[colorScheme];

    // If no data, return empty structure
    if (labels.length === 0 || values.every(v => v === 0)) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            label: type === 'jobs' ? 'Jobs' : 'Calls',
            data: [1],
            backgroundColor: ['rgba(200, 200, 200, 0.5)'],
            borderColor: ['rgba(200, 200, 200, 1)'],
            borderWidth: 1,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: type === 'jobs' ? 'Jobs' : 'Calls',
          data: values,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBackgroundColor: colors.slice(0, labels.length).map(color => color.replace('0.8', '0.9')),
          hoverBorderWidth: 3,
        },
      ],
    };
  };

  // Chart options
  const getChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animationDuration,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: true,
      },
      datalabels: {
        display: showDataLabels,
        color: 'black',
        font: {
          weight: 'bold' as const,
          size: 11,
        },
        formatter: (value: number) => value.toString(),
        anchor: 'end' as const,
        align: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
  });

  // Fixed pie/doughnut options
  const getPieOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: animationDuration,
    },
    plugins: {
      legend: {
        display: showLegend,
        position: 'right' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor[i],
                lineWidth: data.datasets[0].borderWidth,
                hidden: false,
                index: i,
              }));
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: showDataLabels,
        color: 'white',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        formatter: (value: number, context: any) => {
          if (!showDataLabels) return '';
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
          return `${percentage}%`;
        },
        textAlign: 'center' as const,
      },
    },
  });

  // Chart Icons component
  const ChartIcon = ({ type }: { type: GraphType }) => {
    const iconClass = "w-4 h-4 mr-1";
    switch (type) {
      case 'bar':
        return <span className={iconClass}>📊</span>;
      case 'pie':
        return <span className={iconClass}>🥧</span>;
      case 'line':
        return <span className={iconClass}>📈</span>;
      case 'doughnut':
        return <span className={iconClass}>🍩</span>;
      default:
        return <span className={iconClass}>📊</span>;
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Analytics Reports</h1>

      {/* Duration Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">📅 Select Duration</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {["today", "week", "month", "custom"].map((dur) => (
            <button
              key={dur}
              onClick={() => handleDurationChange(dur as Duration)}
              className={`p-4 rounded-lg border-2 font-medium capitalize transition-all duration-200 ${
                duration === dur
                  ? "bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {dur === "week" ? "This Week" : dur === "month" ? "This Month" : dur}
            </button>
          ))}
        </div>

        {duration === "custom" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">📅 From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">📅 To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        <button
          onClick={generateReport}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          🚀 Generate Report
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Report Results */}
      {reportData && (
        <div className="space-y-8">
          {/* View Mode and Chart Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <h2 className="text-xl font-semibold text-gray-800">📈 Report Results</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* View Mode Selection */}
                <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden">
                  <button
                    onClick={() => setViewMode("text")}
                    className={`px-6 py-3 font-semibold transition-colors ${
                      viewMode === "text"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    📊 Text View
                  </button>
                  <button
                    onClick={() => setViewMode("graph")}
                    className={`px-6 py-3 font-semibold transition-colors ${
                      viewMode === "graph"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    📈 Graph View
                  </button>
                </div>

                {/* Graph Type Selection */}
                {viewMode === "graph" && (
                  <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden">
                    {(["bar", "pie", "line", "doughnut"] as GraphType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setGraphType(type)}
                        className={`px-4 py-3 text-sm font-semibold transition-colors flex items-center ${
                          graphType === type
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-700 hover:bg-green-50"
                        }`}
                      >
                        <ChartIcon type={type} />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Chart Controls */}
            {viewMode === "graph" && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">🎛️ Chart Controls</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Color Scheme */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">🎨 Color Scheme</label>
                    <select
                      value={colorScheme}
                      onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="default">Default</option>
                      <option value="warm">Warm</option>
                      <option value="cool">Cool</option>
                      <option value="pastel">Pastel</option>
                      <option value="vibrant">Vibrant</option>
                    </select>
                  </div>

                  {/* Chart Height */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">📏 Chart Height</label>
                    <select
                      value={chartHeight}
                      onChange={(e) => setChartHeight(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="256">Small (256px)</option>
                      <option value="320">Medium (320px)</option>
                      <option value="384">Large (384px)</option>
                      <option value="448">X-Large (448px)</option>
                    </select>
                  </div>

                  {/* Animation Duration */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">⏱️ Animation (ms)</label>
                    <input
                      type="range"
                      min="0"
                      max="3000"
                      step="100"
                      value={animationDuration}
                      onChange={(e) => setAnimationDuration(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{animationDuration}ms</div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showLegend}
                        onChange={(e) => setShowLegend(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">📋 Show Legend</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showDataLabels}
                        onChange={(e) => setShowDataLabels(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">🏷️ Show Data Labels</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={showGrid}
                        onChange={(e) => setShowGrid(e.target.checked)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">📏 Show Grid</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">Total Jobs</h3>
                  <p className="text-4xl font-bold">{reportData.totalJobs}</p>
                </div>
                <div className="text-6xl opacity-20">💼</div>
              </div>
              <p className="text-sm opacity-75 mt-4">
                📅 {new Date(reportData.dateRange.from).toLocaleDateString()} to{" "}
                {new Date(reportData.dateRange.to).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 opacity-90">Total Calls</h3>
                  <p className="text-4xl font-bold">{reportData.totalCalls}</p>
                </div>
                <div className="text-6xl opacity-20">📞</div>
              </div>
              <p className="text-sm opacity-75 mt-4">
                📅 {new Date(reportData.dateRange.from).toLocaleDateString()} to{" "}
                {new Date(reportData.dateRange.to).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Text View */}
          {viewMode === "text" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  💼 Jobs by Marketing Team
                </h3>
                {Object.keys(reportData.jobsByMarketingTeam).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(reportData.jobsByMarketingTeam)
                      .sort(([,a], [,b]) => b - a)
                      .map(([team, count]) => (
                      <div key={team} className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{team || "Not Specified"}</span>
                        <span className="font-bold text-blue-600 text-xl">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">📭 No jobs found for this period</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                  📞 Calls by Marketing Team
                </h3>
                {Object.keys(reportData.callsByMarketingTeam).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(reportData.callsByMarketingTeam)
                      .sort(([,a], [,b]) => b - a)
                      .map(([team, count]) => (
                      <div key={team} className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{team || "Not Specified"}</span>
                        <span className="font-bold text-green-600 text-xl">{count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">📭 No calls found for this period</p>
                )}
              </div>
            </div>
          )}

          {/* Graph View */}
          {viewMode === "graph" && (
            <div className="space-y-8">
              {/* Combined Chart */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📊 Jobs vs Calls by Marketing Team</h3>
                <div style={{ height: `${chartHeight}px` }}>
                  {graphType === "bar" && getCombinedChartData() && (
                    <Bar 
                      data={getCombinedChartData()!} 
                      options={getChartOptions("Jobs vs Calls Comparison")} 
                    />
                  )}
                  {graphType === "line" && getCombinedChartData() && (
                    <Line 
                      data={getCombinedChartData()!} 
                      options={getChartOptions("Jobs vs Calls Trend")} 
                    />
                  )}
                  {(graphType === "pie" || graphType === "doughnut") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                      <div className="flex flex-col h-full">
                        <h4 className="text-lg font-semibold mb-4 text-center text-gray-800">💼 Jobs Distribution</h4>
                        <div className="flex-1 min-h-0">
                          {Object.keys(reportData.jobsByMarketingTeam).length > 0 ? (
                            <>
                              {graphType === "pie" && (
                                <Pie 
                                  data={getPieChartData(reportData.jobsByMarketingTeam, 'jobs')} 
                                  options={getPieOptions('Jobs by Marketing Team')} 
                                />
                              )}
                              {graphType === "doughnut" && (
                                <Doughnut 
                                  data={getPieChartData(reportData.jobsByMarketingTeam, 'jobs')} 
                                  options={getPieOptions('Jobs by Marketing Team')} 
                                />
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              📭 No jobs data available
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col h-full">
                        <h4 className="text-lg font-semibold mb-4 text-center text-gray-800">📞 Calls Distribution</h4>
                        <div className="flex-1 min-h-0">
                          {Object.keys(reportData.callsByMarketingTeam).length > 0 ? (
                            <>
                              {graphType === "pie" && (
                                <Pie 
                                  data={getPieChartData(reportData.callsByMarketingTeam, 'calls')} 
                                  options={getPieOptions('Calls by Marketing Team')} 
                                />
                              )}
                              {graphType === "doughnut" && (
                                <Doughnut 
                                  data={getPieChartData(reportData.callsByMarketingTeam, 'calls')} 
                                  options={getPieOptions('Calls by Marketing Team')} 
                                />
                              )}
                            </>
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                              📭 No calls data available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Individual Charts for Bar/Line only */}
              {!["pie", "doughnut"].includes(graphType) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">💼 Jobs by Marketing Team</h3>
                    <div style={{ height: `${parseInt(chartHeight) * 0.75}px` }}>
                      {graphType === "bar" && getJobsChartData() && (
                        <Bar data={getJobsChartData()!} options={getChartOptions("Jobs Distribution")} />
                      )}
                      {graphType === "line" && getLineJobsChartData() && (
                        <Line data={getLineJobsChartData()!} options={getChartOptions("Jobs Trend")} />
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold mb-6 text-gray-800">📞 Calls by Marketing Team</h3>
                    <div style={{ height: `${parseInt(chartHeight) * 0.75}px` }}>
                      {graphType === "bar" && getCallsChartData() && (
                        <Bar data={getCallsChartData()!} options={getChartOptions("Calls Distribution")} />
                      )}
                      {graphType === "line" && getLineCallsChartData() && (
                        <Line data={getLineCallsChartData()!} options={getChartOptions("Calls Trend")} />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
