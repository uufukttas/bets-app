'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  animated?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Badge = ({ 
  children, 
  variant = 'primary', 
  animated = false,
  size = 'md',
  className = '' 
}: BadgeProps) => {
  const variantStyles: Record<BadgeVariant, string> = {
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    secondary: 'bg-gray-100 text-gray-800 border border-gray-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    info: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-md',
    lg: 'text-sm px-3 py-1 rounded-md',
  };

  const baseStyle = 'inline-flex items-center font-medium';

  if (animated) {
    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge; 