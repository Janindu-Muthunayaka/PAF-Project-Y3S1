const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ];
  
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };
  
  const Avatar = ({
    src,
    alt,
    name,
    size = 'md',
    className = '',
    ...props
  }) => {
    const sizeClasses = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
      '2xl': 'h-20 w-20 text-2xl',
    };
    
    const bgColor = name ? getColorFromName(name) : 'bg-gray-200 dark:bg-gray-700';
    
    const classes = [
      'rounded-full flex-shrink-0',
      sizeClasses[size],
      className
    ].join(' ');
    
    if (src) {
      return (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={classes}
          {...props}
        />
      );
    }
    
    return (
      <div 
        className={`${classes} ${bgColor} flex items-center justify-center text-white`}
        {...props}
      >
        {name ? name.charAt(0).toUpperCase() : '?'}
      </div>
    );
  };
  
  export default Avatar;