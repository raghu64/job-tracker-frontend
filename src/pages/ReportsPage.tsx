import React, { useState, useMemo, useEffect } from "react";
import { useJobs } from "../contexts/JobsContext";
import { useCalls } from "../contexts/CallsContext";
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
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';
import { DateTime } from 'luxon';

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

type Duration = "today" | "yesterday" | "week" | "month" | "custom";

interface DailyBreakdown {
    date: string;
    jobs: number;
    calls: number;
}

interface ReportData {
    totalJobs: number;
    totalCalls: number;
    jobsByMarketingTeam: { [key: string]: number };
    callsByMarketingTeam: { [key: string]: number };
    dailyBreakdown: DailyBreakdown[];
    dateRange: {
        from: string;
        to: string;
    };
}

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log("User Time Zone: ", timeZone);

const parseDateLuxon = (dateString: string, daysDiff: number = 0): Date => {
    console.log(`Parsing date: ${dateString} with daysDiff: ${daysDiff}`);
    const dt = DateTime.fromISO(dateString, { zone: timeZone }).minus({ days: daysDiff });
    if (!dt.isValid) {
        throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    return dt.toJSDate();
};

// Helper function to check if a date is a weekday (Monday-Friday)
const isWeekday = (date: Date): boolean => {
    const day = date.getDay();
    return day >= 1 && day <= 5; // 1 = Monday, 5 = Friday
};

// Helper function to generate daily breakdown
const generateDailyBreakdown = (filteredJobs: any[], filteredCalls: any[], startDate: Date, endDate: Date): DailyBreakdown[] => {
    const dailyData: DailyBreakdown[] = [];

    // Create maps for quick lookup
    const jobsByDate = new Map<string, number>();
    const callsByDate = new Map<string, number>();

    // Group jobs by date
    filteredJobs.forEach(job => {
        const jobDate = new Date(job.dateSubmitted);
        if (isWeekday(jobDate)) {
            const dateStr = jobDate.toISOString().split('T')[0];
            jobsByDate.set(dateStr, (jobsByDate.get(dateStr) || 0) + 1);
        }
    });

    // Group calls by date
    filteredCalls.forEach(call => {
        const callDate = new Date(call.date);
        if (isWeekday(callDate)) {
            const dateStr = callDate.toISOString().split('T')[0];
            callsByDate.set(dateStr, (callsByDate.get(dateStr) || 0) + 1);
        }
    });

    // Generate daily entries for the entire date range
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
        const dateStr = currentDate.toISOString().split('T')[0];

        dailyData.push({
            date: dateStr,
            jobs: jobsByDate.get(dateStr) || 0,
            calls: callsByDate.get(dateStr) || 0,
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dailyData;
};

export default function ReportsPage() {
    const [duration, setDuration] = useState<Duration>("today");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [error, setError] = useState("");
    const showLegend = false;
    const showTitle = false;
    const showDataLabels = true;
    const showGrid = true;
    const chartHeight = "384";

    // Get data from contexts
    const { jobs } = useJobs();
    const { calls } = useCalls();








    // Helper function to get date range
    const getDateRange = (
        duration: string,
        customFrom: string | null = null,
        customTo: string | null = null
    ) => {
        let startDate: Date, endDate: Date;

        switch (duration) {
            case 'today':
                startDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate());
                endDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate());
                break;

            case 'yesterday':
                startDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate(), 1);
                endDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate(), 1);
                break;

            case 'week':
                startDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate(), 6);
                endDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate());
                break;

            case 'month':
                startDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate(), 29);
                endDate = parseDateLuxon(DateTime.now().setZone(timeZone).toISODate());
                break;

            case 'custom':
                if (!customFrom || !customTo) {
                    throw new Error('Custom date range requires both from and to dates');
                }
                startDate = parseDateLuxon(customFrom);
                endDate = parseDateLuxon(customTo);
                endDate.setHours(23, 59, 59, 999); // Include the entire end date
                break;

            default:
                throw new Error('Invalid duration specified');
        }

        return { startDate, endDate };
    };



    // Compute report data using useMemo for performance
    const reportData: ReportData | null = useMemo(() => {
        if (!jobs || !calls) return null;

        try {
            // If custom dates not set, return null to show the selection UI
            if (duration === "custom" && (!fromDate || !toDate)) {
                return null;
            }

            const { startDate, endDate } = getDateRange(duration, fromDate || null, toDate || null);

            // Filter jobs by date range
            const filteredJobs = jobs.filter(job => {
                const jobDate = DateTime.fromISO(job.dateSubmitted, { zone: timeZone }).toJSDate();
                return jobDate >= startDate && jobDate <= endDate;
            });

            // Filter calls by date range
            const filteredCalls = calls.filter(call => {
                const callDate = DateTime.fromISO(call.date, { zone: timeZone }).toJSDate();
                return callDate >= startDate && callDate <= endDate;
            });

            // Group jobs by marketing team
            const jobsByMarketingTeam: { [key: string]: number } = filteredJobs.reduce((acc, job) => {
                const team = job.marketingTeam || 'Not Specified';
                acc[team] = (acc[team] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number }); // Add explicit type here

            // Group calls by marketing team
            const callsByMarketingTeam: { [key: string]: number } = filteredCalls.reduce((acc, call) => {
                const team = call.marketingTeam || 'Not Specified';
                acc[team] = (acc[team] || 0) + 1;
                return acc;
            }, {} as { [key: string]: number }); // Add explicit type here


            // Generate daily breakdown
            const dailyBreakdown = generateDailyBreakdown(filteredJobs, filteredCalls, startDate, endDate);

            return {
                totalJobs: filteredJobs.length,
                totalCalls: filteredCalls.length,
                jobsByMarketingTeam,
                callsByMarketingTeam,
                dailyBreakdown,
                dateRange: {
                    from: startDate.toISOString(),
                    to: endDate.toISOString()
                }
            };
        } catch (error: any) {
            console.error('Error computing report data:', error);
            setError(error.message);
            return null;
        }
    }, [jobs, calls, duration, fromDate, toDate]);

    const handleDurationChange = (newDuration: Duration) => {
        setDuration(newDuration);
        setError("");
        if (newDuration !== "custom") {
            setFromDate("");
            setToDate("");
        }
    };

    // Validate dates when they change
    useEffect(() => {
        if (duration === "custom" && fromDate && toDate) {
            const start = parseDateLuxon(fromDate);
            const end = parseDateLuxon(toDate);
            if (start > end) {
                setError("Start date must be before end date");
            } else {
                setError("");
            }
        } else {
            setError("");
        }
    }, [fromDate, toDate, duration]);


    // Timeline chart data
    const getTimelineChartData = (): ChartData<'line', number[], string> | null => {
        if (!reportData || !reportData.dailyBreakdown || reportData.dailyBreakdown.length === 0) return null;

        const labels = reportData.dailyBreakdown.map(day => {
            const date = new Date(day.date);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        });

        const jobsData = reportData.dailyBreakdown.map(day => day.jobs);
        const callsData = reportData.dailyBreakdown.map(day => day.calls);

        return {
            labels,
            datasets: [
                {
                    label: 'Jobs per Day',
                    data: jobsData,
                    borderColor: 'rgba(37, 99, 235, 1)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(37, 99, 235, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(37, 99, 235, 1)',
                    tension: 0.4,
                    fill: true,
                } as any,
                {
                    label: 'Calls per Day',
                    data: callsData,
                    borderColor: 'rgba(22, 163, 74, 1)',
                    backgroundColor: 'rgba(22, 163, 74, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: 'rgba(22, 163, 74, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(22, 163, 74, 1)',
                    tension: 0.4,
                    fill: true,
                } as any,
            ],
        };
    };

    // Timeline chart options
    const getTimelineOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
        },
        plugins: {
            legend: {
                display: showLegend,
                position: 'top' as const,
                labels: {
                    padding: 30,
                    usePointStyle: true,
                },
            },
            title: {
                display: showTitle,
                text: 'Daily Activity Timeline',
                font: {
                    size: 18,
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
                callbacks: {
                    title: function (context: any) {
                        const dataIndex = context[0].dataIndex;
                        const date = reportData?.dailyBreakdown[dataIndex]?.date;
                        return date ? new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : '';
                    },
                    label: function (context: any) {
                        return `${context.dataset.label}: ${context.raw}`;
                    }
                }
            },
            datalabels: {
                display: showDataLabels,
                color: 'black',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)',
                // borderColor: 'rgba(0, 0, 0, 0.2)',
                // borderRadius: 4,
                // borderWidth: 1,
                font: {
                    weight: 'bold' as const,
                    size: 10,
                },
                formatter: (value: number) => value > 0 ? value.toString() : '',
                padding: 4,
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
                    font: {
                        size: 11,
                    }
                },
                title: {
                    display: true,
                    text: 'Date',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: showGrid,
                    color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11,
                    }
                },
                title: {
                    display: true,
                    text: 'Count',
                    font: {
                        size: 12,
                        weight: 'bold' as const,
                    }
                }
            },
        },
        interaction: {
            intersect: false,
            mode: 'index' as const,
        },
    });

    // Show loading if data is not available yet
    if (!jobs || !calls) {
        return (
            <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 sm:p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">📊 Report</h1>

            {/* Duration Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800">📅 Select Duration</h2>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    {["today", "yesterday", "week", "month", "custom"].map((dur) => (
                        <button
                            key={dur}
                            onClick={() => handleDurationChange(dur as Duration)}
                            className={`p-4 rounded-lg border-2 font-medium capitalize transition-all duration-200 ${duration === dur
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

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        ⚠️ {error}
                    </div>
                )}
            </div>


            {/* Report Results - Show immediately if we have valid data */}
            {reportData && (
                <div className="space-y-8">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                            <div className="text-base font-semibold text-gray-800">
                                📅 {DateTime.fromISO(reportData.dateRange.from, { zone: timeZone }).toFormat('MM/dd/yyyy')} - {DateTime.fromISO(reportData.dateRange.to, { zone: timeZone }).toFormat('MM/dd/yyyy')}
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
                        <div className="flex-1 bg-blue-500 text-white text-center py-2 px-3 rounded-md">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-bold">{reportData.totalJobs}</span>
                                <span className="text-lg opacity-75">Jobs</span>
                                <span className="text-lg opacity-50">💼</span>
                            </div>
                        </div>

                        <div className="flex-1 bg-green-500 text-white text-center py-2 px-3 rounded-md">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-lg font-bold">{reportData.totalCalls}</span>
                                <span className="text-lg opacity-75">Calls</span>
                                <span className="text-lg opacity-50">📞</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Summary Stats */}
                    {reportData?.dailyBreakdown && reportData.dailyBreakdown.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Daily Activity Summary</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {Math.max(...reportData.dailyBreakdown.map(d => d.jobs))}
                                    </p>
                                    <p className="text-sm text-gray-600">Peak Jobs/Day</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {Math.max(...reportData.dailyBreakdown.map(d => d.calls))}
                                    </p>
                                    <p className="text-sm text-gray-600">Peak Calls/Day</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-purple-600">
                                        {(reportData.totalJobs / reportData.dailyBreakdown.length).toFixed(1)}
                                    </p>
                                    <p className="text-sm text-gray-600">Avg Jobs/Day</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-orange-600">
                                        {(reportData.totalCalls / reportData.dailyBreakdown.length).toFixed(1)}
                                    </p>
                                    <p className="text-sm text-gray-600">Avg Calls/Day</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline Chart */}
                    {reportData?.dailyBreakdown && reportData.dailyBreakdown.length > 0 && (
                        <div className="space-y-8">
                            <div className="bg-white rounded-xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800">📈 Daily Activity Timeline</h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                                            <span>Jobs</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                                            <span>Calls</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ height: `${parseInt(chartHeight) + 50}px` }}>
                                    {getTimelineChartData() ? (
                                        <Line
                                            data={getTimelineChartData()!}
                                            options={getTimelineOptions()}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            📭 No timeline data available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Jobs and Calls by Marketing Team */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
                                💼 Jobs by Marketing Team
                            </h3>
                            {Object.keys(reportData.jobsByMarketingTeam).length > 0 ? (
                                <div className="space-y-4">
                                    {Object.entries(reportData.jobsByMarketingTeam)
                                        .sort(([, a], [, b]) => b - a)
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
                                        .sort(([, a], [, b]) => b - a)
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


                </div>
            )}
        </div>
    );
}
