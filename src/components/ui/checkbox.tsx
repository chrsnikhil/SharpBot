"use client"

import * as React from "react"
import { Check } from 'lucide-react'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            ref={ref}
            {...props}
          />
          <div
            className={`w-4 h-4 border rounded transition-colors ${
              checked
                ? "bg-primary border-primary"
                : "bg-background border-input"
            }`}
          >
            {checked && (
              <Check className="w-3 h-3 text-primary-foreground" />
            )}
          </div>
        </div>
      </label>
    )
  }
)

Checkbox.displayName = "Checkbox"
