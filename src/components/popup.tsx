import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Clock10, BarChart2, List, Settings } from 'lucide-react';
import Stats from './stats';

export default function Popup() {
  const [activeTab, setActiveTab] = useState('timer');
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-80 p-4 bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-4">FocusFlow</h1>
      <div className="flex space-x-2 mb-4">
        <Button
          variant={activeTab === 'timer' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('timer')}
          className="flex-1"
        >
          <Clock10 className="w-4 h-4 mr-2" />
          Timer
        </Button>
        <Button
          variant={activeTab === 'stats' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('stats')}
          className="flex-1"
        >
          <BarChart2 className="w-4 h-4 mr-2" />
          Stats
        </Button>
        <Button
          variant={activeTab === 'tasks' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
          className="flex-1"
        >
          <List className="w-4 h-4 mr-2" />
          Tasks
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('settings')}
          className="flex-1"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {activeTab === 'timer' && (
        <div className="text-center">
          <div className="text-4xl font-bold mb-4">
            {formatTime(timeRemaining)}
          </div>
          <Progress
            value={(1 - timeRemaining / (25 * 60)) * 100}
            className="mb-4"
          />
          <Button
            onClick={() => setTimerRunning(!timerRunning)}
            className="w-full"
          >
            {timerRunning ? 'Pause' : 'Start'} Focus Session
          </Button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Block distracting sites</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark mode</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch />
          </div>
        </div>
      )}

      {activeTab === 'stats' && <Stats />}
    </div>
  );
}
