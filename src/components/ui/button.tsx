import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
}

const baseStyles = "bg-black text-white px-3 py-2 rounded-md text-sm transition-all duration-200 ease-in-out"

const variantStyles: Record<ButtonProps["variant"] & string, string> = {
  default: "hover:bg-gray-800 active:bg-gray-700",
  ghost: "bg-opacity-0 hover:bg-opacity-10 active:bg-opacity-20",
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyle = variantStyles[variant] || variantStyles.default

    return <button className={`${baseStyles} ${variantStyle} ${className}`} ref={ref} {...props} />
  },
)

Button.displayName = "Button"

