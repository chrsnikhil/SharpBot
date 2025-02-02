"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, RotateCcw, Edit2 } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"

const TimerCircle: React.FC<{ progress: number }> = ({ progress }) => (
  <svg className="w-32 h-32" viewBox="0 0 100 100">
    <circle className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
    <motion.circle
      className="text-black"
      strokeWidth="4"
      stroke="currentColor"
      fill="transparent"
      r="45"
      cx="50"
      cy="50"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: progress }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      strokeDasharray="283"
      strokeDashoffset="0"
      strokeLinecap="round"
    />
  </svg>
)

const TimerDisplay: React.FC<{ time: number }> = ({ time }) => (
  <motion.div
    className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
    initial={{ scale: 0.5, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    {Math.floor(time / 60)
      .toString()
      .padStart(2, "0")}
    :{(time % 60).toString().padStart(2, "0")}
  </motion.div>
)

const timer: React.FC = () => {
  const [time, setTime] = useState(25 * 60) // Default to 25 minutes
  const [initialTime, setInitialTime] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [customMinutes, setCustomMinutes] = useState("25")
  const [customSeconds, setCustomSeconds] = useState("00")

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, time])

  const handleStart = () => setIsRunning(true)
  const handlePause = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setTime(initialTime)
  }

  const handleCustomTimeSet = () => {
    const newTime = Number.parseInt(customMinutes) * 60 + Number.parseInt(customSeconds)
    setTime(newTime)
    setInitialTime(newTime)
    setIsEditing(false)
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
    if (!isEditing) {
      setCustomMinutes(Math.floor(time / 60).toString())
      setCustomSeconds((time % 60).toString().padStart(2, "0"))
    }
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white text-black p-4 rounded-lg shadow-md w-full max-w-xs mx-auto">
      <div className="relative mb-4">
        <TimerCircle progress={1 - time / initialTime} />
        <TimerDisplay time={time} />
      </div>
      <div className="flex space-x-2 mb-4">
        <AnimatePresence mode="wait">
          {!isRunning ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button onClick={handleStart} className="bg-black text-white rounded-full p-2 hover:bg-gray-800">
                <Play className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="pause"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button onClick={handlePause} className="bg-gray-500 text-white rounded-full p-2 hover:bg-gray-600">
                <Pause className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Button onClick={handleReset} className="bg-gray-200 text-black rounded-full p-2 hover:bg-gray-300">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          onClick={toggleEdit}
          className={`rounded-full p-2 ${isEditing ? "bg-black text-white" : "bg-gray-200 text-black hover:bg-gray-300"}`}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full space-y-2 overflow-hidden"
          >
            <div className="flex items-center justify-center space-x-2">
              <Input
                type="number"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-16 text-center"
                min="0"
                max="59"
              />
              <span className="text-xl font-bold">:</span>
              <Input
                type="number"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                className="w-16 text-center"
                min="0"
                max="59"
              />
            </div>
            <Button onClick={handleCustomTimeSet} className="bg-black text-white hover:bg-gray-800 w-full">
              Set Custom Time
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default timer

