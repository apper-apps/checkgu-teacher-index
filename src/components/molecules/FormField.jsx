import Label from '@/components/atoms/Label'
import { cn } from '@/utils/cn'

const FormField = ({ 
  label, 
  error, 
  required, 
  className, 
  children, 
  id,
  ...props 
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label 
          htmlFor={fieldId}
          required={required}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </Label>
      )}
      <div className="relative">
        {children && typeof children === 'function' 
          ? children({ id: fieldId, 'aria-describedby': errorId })
          : children
        }
      </div>
      {error && (
        <p 
          id={errorId}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="w-4 h-4 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField