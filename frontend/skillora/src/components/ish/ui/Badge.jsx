const Badge = ({
    children,
    variant = 'gray',
    size = 'md',
    className = '',
    ...props
  }) => {
    const baseClasses = "inline-flex items-center rounded-full font-medium";
    
    const variantClasses = {
      primary: "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200",
      secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200",
      gray: "bg-gray-100 text-gray-800 dark:bg-dark-700 dark:text-gray-300",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-xs",
      lg: "px-3 py-1 text-sm",
    };
    
    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    ].join(" ");
    
    return (
      <span className={classes} {...props}>
        {children}
      </span>
    );
  };
  
  export default Badge;