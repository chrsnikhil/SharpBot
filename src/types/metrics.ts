export type Distraction = {
  timestamp: number;
  url: string;
  duration: number;
  category: DistractionCategory;
};

export type DistractionCategory =
  | 'social'
  | 'news'
  | 'shopping'
  | 'entertainment'
  | 'productivity'
  | 'other';

export type FocusSession = {
  startTime: number;
  endTime: number;
  duration: number;
  distractions: Distraction[];
};

export type DailyStats = {
  date: string;
  totalFocusTime: number;
  distractions: Distraction[];
  productiveWebsites: string[];
  unproductiveWebsites: string[];
};
