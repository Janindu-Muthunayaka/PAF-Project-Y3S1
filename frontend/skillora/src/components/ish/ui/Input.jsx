import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  helperText,
  error,
  id,
  className = '',
  fullWidth = true,
  size = 'md',
  leftIcon,
  rightIcon,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  
  const baseClasses = "rounded-lg shadow-sm border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400";
  
  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-3",
    lg: "py-3 px-4 text-lg",
  };
  
  const errorClasses = "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500 dark:border-red-600 dark:text-red-400";
  
  const iconClasses = {
    left: leftIcon ? "pl-10" : "",
    right: rightIcon ? "pr-10" : "",
  };
  
  const inputClasses = [
    baseClasses,
    sizeClasses[size],
    error ? errorClasses : "",
    iconClasses.left,
    iconClasses.right,
    fullWidth ? "w-full" : "",
    className
  ].join(" ");
  
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

export default Input;