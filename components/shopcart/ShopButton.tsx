'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import BetSlip from '@/components/betslip/BetSlip';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import ShoppingCartIcon from '@/public/icons/ShoppingCartIcon';
import { RootState } from '@/store';

const ShopButton: React.FC = () => {
  const cartButtonClassName: string = `cart-button`;
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isOpen, setIsOpen] = useState(false);

  const toggleCart = (): void => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={cn(`${cartButtonClassName}-container`, 'relative')}>
      <Button
        className={cn(
          `${cartButtonClassName}`,
          'bg-yellow-500',
          'hover:bg-yellow-600',
          'text-gray-900',
          'p-2',
          'rounded-full',
          'relative'
        )}
        icon={<ShoppingCartIcon />}
        variant="primary"
        onClick={toggleCart}
      >
        {cartItems.length > 0 && (
          <span
            className={cn(
              `${cartButtonClassName}-count`,
              'absolute',
              '-top-2',
              '-right-2',
              'bg-red-600',
              'text-white',
              'text-xs',
              'font-bold',
              'rounded-full',
              'h-5',
              'w-5',
              'flex',
              'items-center',
              'justify-center'
            )}
          >
            {cartItems.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div
          className={cn(
            `${cartButtonClassName}-overlay`,
            'fixed',
            'inset-0',
            'bg-black',
            'bg-opacity-50',
            'z-40',
            'flex',
            'justify-end'
          )}
        >
          <BetSlip onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
};

export default ShopButton;
