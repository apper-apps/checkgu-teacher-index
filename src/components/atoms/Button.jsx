import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-sm hover:shadow-md",
    secondary: "bg-secondary-500 hover:bg-secondary-600 text-white shadow-sm hover:shadow-md",
    outline: "border border-primary-500 text-primary-500 hover:bg-primary-50 bg-white",
    ghost: "hover:bg-gray-100 text-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;