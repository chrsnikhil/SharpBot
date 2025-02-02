"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock10, BarChart2, List, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import Timer from "./ui/timer" // Import the Timer component
import Chatbot from "./Chatbot" // Import the Chatbot component

interface SiteData {
  name: string
  visits: number
}

export default function Popup() {
  const [activeTab, setActiveTab] = useState("timer")
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete project proposal", completed: false },
    { id: 2, text: "Review documentation", completed: true },
    { id: 3, text: "Team meeting prep", completed: false },
  ])
  const [newTask, setNewTask] = useState("")
  const [topSites, setTopSites] = useState<SiteData[]>([])

  // Fetch top sites when stats tab is active
  useEffect(() => {
    async function fetchMostVisitedURLs() {
      try {
        const sites = await chrome.topSites.get()
        const transformedData: SiteData[] = sites.slice(0, 5).map((site, index) => ({
          name: site.title || new URL(site.url).hostname,
          visits: 100 - index * 15,
        }))
        setTopSites(transformedData)
      } catch (err) {
        console.error("Failed to fetch top sites:", err)
      }
    }

    if (activeTab === "stats" && typeof chrome !== "undefined" && chrome.topSites) {
      fetchMostVisitedURLs()
    }
  }, [activeTab])

  // Toggle task completion
  const toggleTask = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Add a new task
  const addTask = () => {
    if (newTask.trim() === "") return // Prevent empty tasks
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
    }
    setTasks([...tasks, newTaskObj])
    setNewTask("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden"
    >
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">FocusFlow</h1>
        </div>

        <div className="flex space-x-2 mb-4">
          {["timer", "stats", "tasks", "ai"].map((tab) => (
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.div>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-auto p-4">
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
              <Timer /> {/* Use the Timer component here */}
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
              <h2 className="text-lg font-bold mb-2">Most Visited Websites</h2>
              <ul className="space-y-2">
                {topSites.map((site) => (
                  <li key={site.name} className="flex justify-between p-2 border rounded-lg">
                    <span>{site.name}</span>
                    <span>{site.visits} visits</span>
                  </li>
                ))}
              </ul>
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
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task..."
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <Button onClick={addTask} className="flex-none">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ai" && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="w-full h-full"
            >
              <Chatbot /> {/* Render the Chatbot component */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

