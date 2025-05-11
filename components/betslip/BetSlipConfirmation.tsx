import React from 'react';
import { cn } from '@/lib/utils';
import Button from '../ui/Button';
import type { IBetSlipConfirmationProps } from '@/types/betSlip';

const BetSlipConfirmation: React.FC<IBetSlipConfirmationProps> = ({
  stake,
  formattedTotalOdds,
  potentialWin,
  selections,
  handleCancelConfirmation,
  handlePlaceBet,
}: IBetSlipConfirmationProps) => {
  const betSlipConfirmationClassName: string = `bet-slip-confirmation-content`;

  return (
    <div
      className={cn(
        `${betSlipConfirmationClassName}-container`,
        'fixed',
        'inset-0',
        'bg-black',
        'bg-opacity-70',
        'flex',
        'items-center',
        'justify-center',
        'z-50',
        'px-4'
      )}
    >
      <div className={cn(`${betSlipConfirmationClassName}`, 'bg-gray-800', 'rounded-lg', 'p-6', 'max-w-md', 'w-full')}>
        <h4 className={cn(`${betSlipConfirmationClassName}-title`, 'text-white', 'font-bold', 'text-lg', 'mb-4')}>
          Confirm Your Bet
        </h4>
        <div className={cn(`${betSlipConfirmationClassName}-details`, 'mb-4')}>
          <div className={cn(`${betSlipConfirmationClassName}-details-text`, 'text-gray-300', 'mb-2')}>
            You are about to place the following bet:
          </div>
          <div className={cn(`${betSlipConfirmationClassName}-details-info`, 'bg-gray-700', 'p-3', 'rounded-md')}>
            <div className={cn(`${betSlipConfirmationClassName}-details-info-stake`, 'text-white', 'mb-2')}>
              <span className={cn(`${betSlipConfirmationClassName}-details-info-stake-label`, 'font-medium')}>
                Stake:
              </span>{' '}
              ₺{stake}
            </div>
            <div className={cn(`${betSlipConfirmationClassName}-details-odds`, 'text-white', 'mb-2')}>
              <span className={cn(`${betSlipConfirmationClassName}-details-odds-label`, 'font-medium')}>
                Total Odds:
              </span>{' '}
              {formattedTotalOdds}
            </div>
            <div className={cn(`${betSlipConfirmationClassName}-details-potential-win`, 'text-white', 'mb-2')}>
              <span
                className={cn(`${betSlipConfirmationClassName}-details-potential-win-label`, 'font-medium')}
              >
                Potential Win:
              </span>{' '}
              ₺{potentialWin}
            </div>
            <div className={cn(`${betSlipConfirmationClassName}-details-selections`, 'text-white', 'mb-2')}>
              <span className={cn(`${betSlipConfirmationClassName}-details-selections-label`, 'font-medium')}>
                Number of Selections:
              </span>{' '}
              {selections.length}
            </div>
          </div>
        </div>
        <div className={cn(`${betSlipConfirmationClassName}-buttons`, 'flex', 'space-x-3')}>
          <Button
            className={cn(
              `${betSlipConfirmationClassName}-cancel-button`,
              'flex-1',
              'bg-gray-700',
              'hover:bg-gray-600',
              'text-white',
              'py-2',
              'rounded'
            )}
            onClick={handleCancelConfirmation}
          >
            Cancel
          </Button>
          <Button
            className={cn(
              `${betSlipConfirmationClassName}-submit-button`,
              'flex-1',
              'bg-green-600',
              'hover:bg-green-700',
              'text-white',
              'py-2',
              'rounded'
            )}
            onClick={handlePlaceBet}
          >
            Confirm Bet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BetSlipConfirmation;
