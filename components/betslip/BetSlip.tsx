import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cn } from '@/lib/utils';
import { RootState } from '@/store';
import { clearCart } from '@/store/slices/cartSlice';
import BetContent from './BetContent';
import BetSlipConfirmation from './BetSlipConfirmation';
import BetSlipHeader from './BetSlipHeader';
import type { IBetSlipProps, IBetResultProps } from '@/types/betSlip';

const BetSlip: React.FC<IBetSlipProps> = ({ onClose }: IBetSlipProps) => {
  const betSlipClassName: string = `bet-slip-panel`;
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const [stake, setStake] = useState<string>(cart.totalStake.toString() || '');
  const [potentialWin, setPotentialWin] = useState<string>('0.00');
  const [isPlacingBet, setIsPlacingBet] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [betResult, setBetResult] = useState<IBetResultProps | null>(null);

  const totalOdds: number = cart.items.length > 0 ? cart.totalOdds : 1;
  const formattedTotalOdds: string = totalOdds.toFixed(2);

  const handleCancelConfirmation = (): void => setShowConfirmation(false);
  const handlePlaceBet = (): void => {
    setShowConfirmation(false);
    setIsPlacingBet(true);
    setBetResult(null);

    setTimeout(() => {
      const isSuccess: boolean = Math.random() > 0.1;

      if (isSuccess) {
        setBetResult({
          success: true,
          message: `Bet placed successfully! Bet ID: BET-${Math.floor(Math.random() * 10000000)}`,
        });

        dispatch(clearCart());
        setStake('');
      } else {
        setBetResult({
          success: false,
          message: 'Failed to place bet. Please try again.',
        });
      }

      setIsPlacingBet(false);
    }, 1500);
  };

  useEffect(() => {
    if (stake && !isNaN(Number(stake))) {
      const win: number = Number(stake) * totalOdds;

      setPotentialWin(win.toFixed(2));
    } else {
      setPotentialWin('0.00');
    }
  }, [stake, totalOdds]);

  useEffect(() => {
    setBetResult(null);
    setStake(cart.totalStake.toString());
  }, [cart]);

  return (
    <div className={cn(`${betSlipClassName}-container`, 'bg-gray-800', 'rounded-lg', 'overflow-hidden')}>
      <BetSlipHeader cartCount={cart.items.length} onClose={onClose} />
      <BetContent
        betResult={betResult}
        formattedTotalOdds={formattedTotalOdds}
        isPlacingBet={isPlacingBet}
        potentialWin={potentialWin}
        stake={stake}
        onClose={onClose}
        setShowConfirmation={setShowConfirmation}
        setStake={setStake}
      />
      {showConfirmation && (
        <BetSlipConfirmation
          stake={stake}
          formattedTotalOdds={formattedTotalOdds}
          potentialWin={potentialWin}
          selections={cart.items}
          handleCancelConfirmation={handleCancelConfirmation}
          handlePlaceBet={handlePlaceBet}
        />
      )}
    </div>
  );
};

export default BetSlip;
