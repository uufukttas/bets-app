import React from 'react';
import { useDispatch } from 'react-redux';
import { EventTypes, trackEvent } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import CloseIcon from '@/public/icons/CloseIcon';
import { clearCart } from '@/store/slices/cartSlice';
import Button from '../ui/Button';
import type { IBetSlipHeaderProps } from '@/types/betSlip';

const BetSlipHeader: React.FC<IBetSlipHeaderProps> = ({ cartCount, onClose }: IBetSlipHeaderProps) => {
  const betSlipHeaderClassName: string = `bet-slip-header`;
  const dispatch = useDispatch();

  const handleClearAll = (): void => {
    dispatch(clearCart());

    trackEvent(EventTypes.CLEAR_CART, {
      event_id: '',
      event_name: EventTypes.CLEAR_CART,
      sport_key: '',
    });
  };

  return (
    <div
      className={cn(
        `${betSlipHeaderClassName}`,
        'bg-gray-700',
        'px-4',
        'py-3',
        'flex',
        'justify-between',
        'items-center'
      )}
    >
      <h3 className={cn(`${betSlipHeaderClassName}-title`, 'font-bold', 'text-white')}>Bet Slip ({cartCount})</h3>
      <div className={cn(`${betSlipHeaderClassName}-buttons`, 'flex', 'items-center', 'space-x-2')}>
        {cartCount > 0 && (
          <Button
            className={cn(
              `${betSlipHeaderClassName}-clear-all-button`,
              'text-sm',
              'text-gray-300',
              'hover:text-white',
              'px-2',
              'py-1',
              'hover:bg-gray-600',
              'rounded'
            )}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        )}
        {onClose && (
          <Button
            className={cn(`${betSlipHeaderClassName}-close-button`, 'text-gray-300', 'hover:text-white')}
            onClick={onClose}
          >
            <CloseIcon />
          </Button>
        )}
      </div>
    </div>
  );
};

export default BetSlipHeader;
