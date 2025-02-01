import { useEffect } from 'react';

function Stats() {
  useEffect(() => {
    async function fetchMostVisitedURLs() {
      const mostVisitedURLs = chrome.topSites.get();
      console.log(mostVisitedURLs);
    }
    fetchMostVisitedURLs();
  }, []);

  return (
    <div>
      <h1 className="font-bold text-lg">Stats</h1>
      <p>Bar graph</p>
    </div>
  );
}

export default Stats;
