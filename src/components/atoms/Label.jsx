import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = React.forwardRef(({ 
  className,
  required = false,
  children,
  ...props 
}, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700 mb-1",
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span 
        className="text-red-500 ml-1" 
        aria-label="required"
        title="This field is required"
      >
        *
      </span>
    )}
  </label>
))

Label.displayName = "Label"

export default Label