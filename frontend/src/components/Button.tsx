import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500",
    secondary: "bg-dark-700 hover:bg-dark-600 text-slate-200 focus:ring-dark-500",
    destructive: "bg-accent-red/90 hover:bg-accent-red text-white focus:ring-accent-red",
    outline: "border border-dark-600 hover:bg-dark-700 text-slate-300 focus:ring-dark-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
