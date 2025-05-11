import React from 'react';
import { CartItem } from '@/store/slices/cartSlice';
import { cn } from '@/lib/utils';
import CloseIcon from '@/public/icons/CloseIcon';
import Button from '../ui/Button';
import type { IBetSelectedProps } from '@/types/betSlip';

const BetSelected: React.FC<IBetSelectedProps> = ({ selections, handleRemoveBet }: IBetSelectedProps) => {
  const betSelectedClassName: string = `bet-selected-list-item`;

  return (
    <div className={cn(`${betSelectedClassName}-section-container`, 'space-y-2', 'mb-4')}>
      {selections.map((item: CartItem) => (
        <div key={item.id} className={cn(`${betSelectedClassName}`, 'bg-gray-700', 'rounded-md', 'p-3')}>
          <div className={cn(`${betSelectedClassName}-wrapper`, 'flex', 'justify-between', 'items-start')}>
            <div className={cn(`${betSelectedClassName}-container`, 'flex', 'flex-col', 'items-start')}>
              <div className={cn(`${betSelectedClassName}-title`, 'font-medium', 'text-white')}>
                {item.event.home_team} vs {item.event.away_team}
              </div>
              <div className={cn(`${betSelectedClassName}-market`, 'text-sm', 'text-gray-300', 'mt-1')}>
                {item.market}:{' '}
                <span className={cn(`${betSelectedClassName}-market-name`, `text-white`)}>{item.outcome.name}</span>
              </div>
            </div>
            <Button
              className={cn(`${betSelectedClassName}-remove-button`, 'text-gray-400', 'hover:text-white')}
              onClick={() => handleRemoveBet(item.id)}
            >
              <CloseIcon />
            </Button>
          </div>
          <div className={cn(`${betSelectedClassName}-bet-odds-container`, 'flex', 'justify-end', 'mt-2')}>
            <div
              className={cn(
                `${betSelectedClassName}-bet-odds`,
                'bg-yellow-200',
                'text-black',
                'px-2',
                'py-1',
                'rounded',
                'text-sm',
                'font-medium'
              )}
            >
              {item.outcome.price.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BetSelected;
