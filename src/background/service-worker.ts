/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import {
  FocusSession,
  Distraction,
  DailyStats,
  DistractionCategory,
} from '../types/metrics';

let currentSession: FocusSession | null = null;
let lastActiveTime = Date.now();
const distractionThreshold = 30 * 10000; // 30 seconds

function startNewSession() {
  currentSession = {
    startTime: Date.now(),
    endTime: 0,
    duration: 0,
    distractions: [],
  };
  lastActiveTime = Date.now();
}

chrome.runtime.onStartup.addListener(() => {
  startNewSession();
});

function checkForDistraction(url: string) {
  const now = Date.now();
  const timeSinceLastActive = now - lastActiveTime;

  if (timeSinceLastActive > distractionThreshold && currentSession) {
    const category = categorizeUrl(url);
    const distraction: Distraction = {
      timestamp: now,
      url,
      duration: timeSinceLastActive,
      category,
    };
    currentSession.distractions.push(distraction);
  }

  lastActiveTime = now;
}

function categorizeUrl(url: string): DistractionCategory {
  const distractionPatterns = {
    social: [
      'facebook.com',
      'x.com',
      'instagram.com',
      'twitter.com',
      'reddit.com',
    ],
    entertainment: ['netflix.com', 'youtube.com', 'twitch.tv'],
    productivity: ['github.com', 'codepen.io', 'repl.it'],
  };

  for (const [category, patterns] of Object.entries(distractionPatterns)) {
    if (patterns.some(pattern => url.includes(pattern))) {
      return category as DistractionCategory;
    }
  }
  return 'other';
}

chrome.tabs.onActivated.addListener(async activeInfo => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  checkForDistraction(tab.url ?? '');
});

console.log('Server worker started');

self.addEventListener('install', _ => {
  console.log('Server worker installed');
  void self.skipWaiting();
});

self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activated');
  void event.waitUntil(self.clients.claim());
});

export {};

// Save stats periodically
async function loadDailyStats(): Promise<DailyStats> {
  const date = new Date().toISOString().split('T')[0];
  const data = await chrome.storage.local.get('dailyStats');

  if (data.dailyStats?.date === date) {
    return data.dailyStats;
  }

  return {
    date,
    totalFocusTime: 0,
    distractions: [],
    productiveWebsites: [],
    unproductiveWebsites: [],
  };
}

async function saveCurrentStats() {
  if (!currentSession) return;

  const stats = await loadDailyStats();
  stats.totalFocusTime += Date.now() - lastActiveTime;
  stats.distractions.push(...currentSession.distractions);

  await chrome.storage.local.set({ dailyStats: stats });
}

chrome.alarms.create('saveStats', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'saveStats') {
    void saveCurrentStats();
  }
});
