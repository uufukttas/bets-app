import React from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { IBetButtonsProps } from '@/types/betSlip';

const BetButtons = ({ isPlacingBet, stake, handleShowConfirmation }: IBetButtonsProps) => {
  const betButtonsClassName: string = `bet-action-button`;
  const variant = stake && Number(stake) > 0 ? 'success' : 'secondary';

  return (
    <Button
      variant={variant}
      fullWidth
      className={cn(`${betButtonsClassName}`, 'mt-4')}
      disabled={isPlacingBet || !stake || Number(stake) <= 0}
      onClick={handleShowConfirmation}
      isLoading={isPlacingBet}
    >
      {isPlacingBet ? 'Processing...' : 'Place Bet'}
    </Button>
  );
};

export default BetButtons;
