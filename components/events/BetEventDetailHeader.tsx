import React from 'react';
import { IBetEventDetailHeaderProps } from '@/types/eventDetail';
import { cn } from '@/lib/utils';
import CloseIcon from '@/public/icons/CloseIcon';
import Button from '../ui/Button';

const BetEventDetailHeader: React.FC<IBetEventDetailHeaderProps> = ({ isLive, onClose }) => {
  const betEventDetailHeaderClassName: string = 'bet-event-detail-header';
  return (
    <div
      className={cn(
        betEventDetailHeaderClassName,
        'bg-gray-800 px-4 py-3 flex justify-between items-center border-b border-gray-700 sticky top-0 z-10'
      )}
    >
      <h3 className={cn(`${betEventDetailHeaderClassName}-title`, 'font-bold text-lg')}>
        {isLive ? 'Live Match Details' : 'Detailed Betting Options'}
      </h3>
      <Button
        className={cn(`${betEventDetailHeaderClassName}-close-button`, 'text-gray-400 hover:text-white')}
        onClick={onClose}
      >
        <CloseIcon />
      </Button>
    </div>
  );
};

export default BetEventDetailHeader;
