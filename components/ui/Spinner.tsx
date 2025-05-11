import { cn } from '@/lib/utils';
import React from 'react';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'border' | 'dots' | 'grow';
type SpinnerColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  color?: SpinnerColor;
  className?: string;
  fullPage?: boolean;
  label?: string;
}

export const Spinner = ({
  size = 'md',
  variant = 'border',
  color = 'primary',
  className = '',
  fullPage = false,
  label = 'Loading...',
}: SpinnerProps) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'border-blue-500',
    secondary: 'border-gray-600',
    success: 'border-green-500',
    danger: 'border-red-500',
    warning: 'border-yellow-500',
    info: 'border-sky-500',
    light: 'border-gray-300',
    dark: 'border-gray-800',
  };

  const renderBorderSpinner = () => {
    return (
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-t-transparent',
          colorClasses[color],
          sizeClasses[size],
          className
        )}
      >
        <span className="sr-only">{label}</span>
      </div>
    );
  };

  const renderDotsSpinner = () => {
    const dotBaseClass = `rounded-full ${sizeClasses[size].split(' ')[0].replace('h-', 'h-').split('/')[0]}`;

    const dotColors = {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-600',
      success: 'bg-green-500',
      danger: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-sky-500',
      light: 'bg-gray-300',
      dark: 'bg-gray-800',
    };

    return (
      <div className={`flex space-x-1 ${className}`}>
        <div className={`${dotBaseClass} ${dotColors[color]} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`${dotBaseClass} ${dotColors[color]} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        <div className={`${dotBaseClass} ${dotColors[color]} animate-bounce`} style={{ animationDelay: '600ms' }}></div>
        <span className="sr-only">{label}</span>
      </div>
    );
  };

  const renderGrowSpinner = () => {
    const growColors = {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-600',
      success: 'bg-green-500',
      danger: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-sky-500',
      light: 'bg-gray-300',
      dark: 'bg-gray-800',
    };

    return (
      <div className={`${sizeClasses[size]} ${growColors[color]} rounded-full animate-pulse ${className}`}>
        <span className="sr-only">{label}</span>
      </div>
    );
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return renderDotsSpinner();
      case 'grow':
        return renderGrowSpinner();
      case 'border':
      default:
        return renderBorderSpinner();
    }
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          {renderSpinner()}
          {label && <p className="mt-3 text-gray-700">{label}</p>}
        </div>
      </div>
    );
  }

  return renderSpinner();
};

export default Spinner;
