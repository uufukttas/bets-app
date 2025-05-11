'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

const Card = ({ children, className = '', hoverEffect = false, onClick }: CardProps) => {
  const baseClass = 'bg-white rounded-lg shadow-sm overflow-hidden';
  const hoverClass = hoverEffect ? 'hover:shadow-md transition-shadow cursor-pointer' : '';
  
  if (onClick) {
    return (
      <motion.div
        className={`${baseClass} ${hoverClass} ${className}`}
        onClick={onClick}
        whileHover={hoverEffect ? { scale: 1.02, y: -4 } : {}}
        whileTap={hoverEffect ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={`${baseClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 border-b ${className}`}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-4 border-t bg-gray-50 ${className}`}>
    {children}
  </div>
); 