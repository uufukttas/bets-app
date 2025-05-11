import React from 'react';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { IBetStakeProps } from '@/types/betSlip';

export const BetStake = ({ stake, handleStakeChange, isPlacingBet, potentialWin }: IBetStakeProps) => {
  const betStakeClassName: string = `bet-stake-section`;

  return (
    <div className={cn(`${betStakeClassName}-container`, 'flex', 'items-center', 'mt-4')}>
      <div className={cn(`${betStakeClassName}-input-container`, 'flex-1')}>
        <Input
          type="number"
          min="0"
          value={stake}
          onChange={handleStakeChange}
          label="Stake (₺)"
          placeholder="0.00"
          disabled={isPlacingBet}
          size="sm"
          variant="outlined"
          fullWidth
          className={cn(`${betStakeClassName}-input`, 'w-full')}
          inputClassName="bg-gray-800 border-gray-600 text-white"
          labelClassName="text-gray-400 text-sm"
        />
      </div>
      <div className={cn(`${betStakeClassName}-potential-win-container`, 'ml-3')}>
        <label className={cn(`${betStakeClassName}-potential-win-label`, 'block', 'text-sm', 'text-gray-400', 'mb-1')}>
          Potential Win
        </label>
        <div
          className={cn(
            `${betStakeClassName}-potential-win-value`,
            'bg-gray-800',
            'border',
            'border-gray-600',
            'rounded',
            'px-3',
            'py-2',
            'text-white'
          )}
        >
          ₺{potentialWin}
        </div>
      </div>
    </div>
  );
};

export default BetStake;
