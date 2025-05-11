import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EventTypes, trackEvent } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { removeFromBet } from '@/store/slices/cartSlice';
import { setStake as setReduxStake } from '@/store/slices/cartSlice';
import BetButtons from './BetButtons';
import BetResult from './BetResult';
import BetSelected from './BetSelected';
import BetSlipEmpty from './BetSlipEmpty';
import BetSlipSummary from './BetSlipSummary';
import BetStake from './BetStake';
import type { IBetContentProps } from '@/types/betSlip';

const BetContent: React.FC<IBetContentProps> = ({
  betResult,
  formattedTotalOdds,
  isPlacingBet,
  potentialWin,
  stake,
  onClose,
  setShowConfirmation,
  setStake,
}: IBetContentProps) => {
  const betContentClassName: string = `bet-content`;
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const handleRemoveBet = (id: string): void => {
    dispatch(removeFromBet(id));

    trackEvent(EventTypes.REMOVE_FROM_CART, {
      event_id: id,
      event_name: EventTypes.REMOVE_FROM_CART,
      sport_key: id,
    });
  };
  const handleShowConfirmation = (): void => {
    if (!stake || Number(stake) <= 0 || cart.items.length === 0) return;

    setShowConfirmation(true);
  };
  const handleStakeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;

    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setStake(value);

      if (value !== '' && !isNaN(Number(value))) {
        dispatch(setReduxStake(Number(value)));
      } else {
        dispatch(setReduxStake(0));
      }
    }
  };

  return (
    <div className={cn(`${betContentClassName}-container`, 'p-2')}>
      {cart.items.length === 0 ? (
        <BetSlipEmpty onClose={onClose} />
      ) : (
        <>
          <BetSelected selections={cart.items} handleRemoveBet={handleRemoveBet} />
          {betResult && <BetResult betResult={betResult} />}
          <div className={cn(`${betContentClassName}-total-odds`, 'bg-gray-700', 'rounded-md', 'p-3')}>
            <BetSlipSummary formattedTotalOdds={formattedTotalOdds} />
            <BetStake
              handleStakeChange={handleStakeChange}
              isPlacingBet={isPlacingBet}
              potentialWin={potentialWin}
              stake={stake}
            />
            <BetButtons isPlacingBet={isPlacingBet} stake={stake} handleShowConfirmation={handleShowConfirmation} />
          </div>
        </>
      )}
    </div>
  );
};

export default BetContent;
