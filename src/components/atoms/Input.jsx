import React from 'react'
import { cn } from '@/utils/cn'

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error = false,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border rounded-md transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-0",
        "placeholder:text-gray-400 text-gray-900",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
          : "border-gray-300 focus:border-primary-500 focus:ring-primary-500",
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input