"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock10, BarChart2, List, Settings, Play, Pause, RotateCcw, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Switch } from "./ui/switch"
import { Checkbox } from "./ui/checkbox"

export default function Popup() {
  const [activeTab, setActiveTab] = useState("timer")
  const [timerRunning, setTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(25 * 60)
  const [timerStarted, setTimerStarted] = useState(false)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", completed: false },
    { id: 2, text: "Review documentation", completed: true },
    { id: 3, text: "Team meeting prep", completed: false },
  ])

  // Timer logic remains the same
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimerStarted(true)
    setTimerRunning(true)
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerStarted(false)
    setTimeRemaining(25 * 60)
  }

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="w-[480px] min-h-[320px] p-4 bg-background text-foreground"
    >
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">FocusFlow</h1>
      </div>

      <div className="flex space-x-2 mb-4">
        {["timer", "stats", "tasks", "settings"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-1.5"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center justify-center w-full"
            >
              {tab === "timer" && <Clock10 className="w-4 h-4 mr-2" />}
              {tab === "stats" && <BarChart2 className="w-4 h-4 mr-2" />}
              {tab === "tasks" && <List className="w-4 h-4 mr-2" />}
              {tab === "settings" && <Settings className="w-4 h-4 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </motion.div>
          </Button>
        ))}
      </div>

      <div className="min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeTab === "timer" && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full text-center"
            >
              <div className="text-5xl font-bold mb-4 tabular-nums">{formatTime(timeRemaining)}</div>
              <Progress value={(1 - timeRemaining / (25 * 60)) * 100} className="mb-4 w-full" />
              {!timerStarted ? (
                <Button onClick={startTimer} className="w-full py-2">
                  <Play className="w-4 h-4 mr-2" />
                  Start Focus Session
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setTimerRunning(!timerRunning)} className="flex-1 py-2">
                    {timerRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {timerRunning ? "Pause" : "Resume"}
                  </Button>
                  <Button onClick={resetTimer} variant="ghost" className="flex-1 py-2">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "stats" && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full"
            >
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Today's Focus Time</div>
                    <div className="text-xl font-bold mt-1">2h 15m</div>
                  </div>
                  <div className="border rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Weekly Total</div>
                    <div className="text-xl font-bold mt-1">12h 30m</div>
                  </div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-2">Focus Sessions</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today's Sessions</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed Tasks</span>
                      <span className="font-medium">7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Session</span>
                      <span className="font-medium">25m</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full"
            >
              <div className="space-y-2">
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    className="flex items-center space-x-2 p-2 border rounded-lg"
                    whileHover={{ scale: 1.01 }}
                  >
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.text}
                    </span>
                  </motion.div>
                ))}
                <Button variant="ghost" className="w-full mt-2">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full space-y-3"
            >
              {["Block distracting sites", "Dark mode", "Notifications", "Sound alerts"].map((setting) => (
                <motion.div
                  key={setting}
                  className="flex items-center justify-between"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-sm">{setting}</span>
                  <Switch />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
