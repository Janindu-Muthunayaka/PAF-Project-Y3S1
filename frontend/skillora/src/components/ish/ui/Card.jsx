const Card = ({ 
    children, 
    className = '', 
    hover = false,
    padding = true,
    ...props 
  }) => {
    const baseClasses = "bg-white dark:bg-gray-800 rounded-xl shadow-soft";
    const paddingClasses = padding ? "p-6" : "";
    const hoverClasses = hover ? "hover:shadow-soft-xl transition-shadow duration-300" : "";
    
    const classes = [
      baseClasses,
      paddingClasses,
      hoverClasses,
      className
    ].join(" ");
    
    return (
      <div className={classes} {...props}>
        {children}
      </div>
    );
  };
  
  export default Card;