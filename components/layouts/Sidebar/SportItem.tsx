import React from 'react';
import type { ISportItemProps } from '@/types/sidebar';
import { cn } from '@/lib/utils';

const SportItem: React.FC<ISportItemProps> = ({ sport, isSelected, onSelect }: ISportItemProps) => {
  const sportItemClassName: string = 'sport-item';

  return (
    <li className={cn(`${sportItemClassName}`)}>
      <button
        className={cn(
          `${sportItemClassName}-button w-full text-left pl-6 pr-4 py-2 hover:bg-gray-700 ${
            isSelected ? 'bg-primary' : ''
          }`
        )}
        onClick={() => onSelect(sport.key)}
      >
        <div className={cn(`${sportItemClassName}-button-content flex justify-between items-center`)}>
          <span className={cn(`${sportItemClassName}-button-content-name`)}>{sport.title}</span>
        </div>
      </button>
    </li>
  );
};

export default SportItem;
