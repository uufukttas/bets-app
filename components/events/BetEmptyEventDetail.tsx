import React from 'react';
import { cn } from '@/lib/utils';

const BetEmptyEventDetail: React.FC = () => {
  const betEmptyEventDetailClassName: string = `event-detail-empty`;

  return (
    <div
      className={cn(
        `${betEmptyEventDetailClassName}-wrapper`,
        'h-full',
        'flex',
        'items-center',
        'justify-center',
        'text-gray-500',
        'p-6',
        'text-center'
      )}
    >
      <div
        className={cn(
          `${betEmptyEventDetailClassName}-container`,
          'h-full',
          'flex',
          'items-center',
          'justify-center',
          'text-gray-500',
          'p-6',
          'text-center'
        )}
      >
        <p className={cn(`${betEmptyEventDetailClassName}-title`, 'mb-2')}>
          Select an event from the list to view detailed betting options
        </p>
        <p className={cn(`${betEmptyEventDetailClassName}-description`, 'text-sm')}>
          Compare odds across multiple bookmakers
        </p>
      </div>
    </div>
  );
};

export default BetEmptyEventDetail;
