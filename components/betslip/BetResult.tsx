import React from 'react';
import { cn } from '@/lib/utils';
import { IBetResultComponentProps } from '@/types/betSlip';

const BetResult = ({ betResult }: IBetResultComponentProps) => {
  const betResultClassName: string = `bet-result`;

  return (
    <div
      className={cn(
        `${betResultClassName}-container`,
        'mb-4',
        'p-3',
        'rounded-md',
        betResult.success ? 'bg-green-800 bg-opacity-40 text-green-400' : 'bg-red-800 bg-opacity-40 text-red-400'
      )}
    >
      {betResult.message}
    </div>
  );
};

export default BetResult;
