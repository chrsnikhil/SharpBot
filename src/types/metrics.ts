export type Distraction = {
  timestamp: number;
  url: string;
  duration: number;
  category: string;
};

export type DistractionCategory =
  | 'social'
  | 'news'
  | 'shopping'
  | 'entertainment'
  | 'other';
