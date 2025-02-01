import { motion } from 'framer-motion';

export default function StatsOld() {
  return (
    <motion.div
      key="stats"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="w-full"
    >
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              Today's Focus Time
            </div>
            <div className="text-xl font-bold mt-1">2h 15m</div>
          </div>
          <div className="border rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Weekly Total</div>
            <div className="text-xl font-bold mt-1">12h 30m</div>
          </div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-xs text-muted-foreground mb-2">
            Focus Sessions
          </div>
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
  );
}
