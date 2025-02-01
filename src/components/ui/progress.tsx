import * as React from "react"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={`h-2 w-full bg-gray-200 rounded-full ${className}`} {...props}>
    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }} />
  </div>
))

Progress.displayName = "Progress"

