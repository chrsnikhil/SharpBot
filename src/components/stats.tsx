import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyStats } from '../types/metrics';

export default function Stats() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DailyStats>({
    date: new Date().toISOString().split('T')[0],
    totalFocusTime: 0,
    distractions: [],
    productiveWebsites: [],
    unproductiveWebsites: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await chrome.storage.local.get('dailyStats');

      if (data.dailyStats) {
        setStats(data.dailyStats);
      } else {
        // dummy data for the time being
        const dummyStats: DailyStats = {
          date: new Date().toISOString().split('T')[0],
          totalFocusTime: 0,
          distractions: [
            {
              timestamp: Date.now() - 3600000,
              url: 'example.com',
              duration: 300000,
              category: 'social',
            },
            {
              timestamp: Date.now() - 1800000,
              url: 'example.com',
              duration: 600000,
              category: 'entertainment',
            },
          ],
          productiveWebsites: [],
          unproductiveWebsites: [],
        };

        await chrome.storage.local.set({ dailyStats: dummyStats });
        setStats(dummyStats);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      setError('Failed to load statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const getFocusScore = () => {
    if (stats.totalFocusTime === 0) return 0;
    const distractionTime = stats.distractions.reduce(
      (acc, d) => acc + d.duration,
      0,
    );
    return Math.max(
      0,
      Math.round(
        ((stats.totalFocusTime - distractionTime) / stats.totalFocusTime) * 100,
      ),
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 w-96">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 w-96">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const focusScore = getFocusScore();
  const chartData = stats.distractions.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    duration: Math.round(d.duration / 60000), // Convert to minutes
  }));

  return (
    <div className="w-96">
      <h1 className="text-2xl font-bold mb-4">Focus Dashboard</h1>

      {/* Focus Score */}
      <div className="mb-6 bg-neutral-900 text-neutral-100 rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Focus Score</h2>
        <div className="text-3xl font-bold text-blue-400">{focusScore}%</div>
      </div>

      {/* Focus Time Chart */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Focus Time</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#8884d8"
                name="Minutes"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distraction Analysis */}
      <div className="mb-6 bg-white rounded-lg p-4 shadow">
        <h2 className="text-lg font-semibold mb-2">Top Distractions</h2>
        <div className="space-y-2">
          {Object.entries(
            stats.distractions.reduce(
              (acc, d) => {
                acc[d.category] = (acc[d.category] || 0) + d.duration;
                return acc;
              },
              {} as Record<string, number>,
            ),
          ).map(([category, duration]) => (
            <div key={category} className="flex justify-between items-center">
              <span className="capitalize">{category}</span>
              <span className="text-gray-600">
                {Math.round(duration / 60000)}m
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-gray-500 mt-4">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}
