import React from 'react';
import { cn } from '@/lib/utils';
import type { IBetSlipSummaryProps } from '@/types/betSlip';

const BetSlipSummary = ({ formattedTotalOdds }: IBetSlipSummaryProps) => {
  const betSlipSummaryClassName: string = `bet-slip-summary-total`;

  return (
    <div className={cn(`${betSlipSummaryClassName}-container`, 'flex', 'justify-between', 'items-center', 'mb-2')}>
      <div className={cn(`${betSlipSummaryClassName}-title`, 'text-white', 'font-medium')}>Total Odds</div>
      <div
        className={cn(
          `${betSlipSummaryClassName}-odds`,
          'bg-yellow-200',
          'text-black',
          'px-2',
          'py-1',
          'rounded',
          'text-sm',
          'font-medium'
        )}
      >
        {formattedTotalOdds}
      </div>
    </div>
  );
};

export default BetSlipSummary;
