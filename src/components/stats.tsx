import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SiteData {
  name: string;
  visits: number;
}

const Stats = () => {
  const [topSites, setTopSites] = useState<SiteData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMostVisitedURLs() {
      try {
        const sites = await chrome.topSites.get();
        const transformedData: SiteData[] = sites.slice(0, 10).map((site, index) => ({
          name: site.title || new URL(site.url).hostname,
          visits: 100 - index * 8,
        }));
        setTopSites(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Failed to fetch top sites:', err);
      }
    }

    if (typeof chrome !== 'undefined' && chrome.topSites) {
      fetchMostVisitedURLs();
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Most Visited Websites</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={topSites}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;
