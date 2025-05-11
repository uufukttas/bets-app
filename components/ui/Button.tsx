'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loading } from '@/public/icons/Loading';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'className' | 'disabled'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white shadow-sm',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
  };

  const sizeStyles = {
    sm: 'text-xs py-1.5 px-3 rounded',
    md: 'text-sm py-2 px-4 rounded-md',
    lg: 'text-base py-2.5 px-5 rounded-lg',
  };

  const baseStyle = cn(
    `font-medium`,
    `transition-colors`,
    `focus:outline-none`,
    `focus:ring-2`,
    `focus:ring-offset-2`,
    `focus:ring-blue-500`,
    `disabled:opacity-60`,
    `disabled:cursor-not-allowed`,
    `flex`,
    `items-center`,
    `justify-center`,
    className
  );
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? <Loading /> : icon ? <span className="mr-2">{icon}</span> : null}
      {children}
    </motion.button>
  );
};

export default Button;
