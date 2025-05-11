import React from 'react';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { IBetSlipEmptyProps } from '@/types/betSlip';

const BetSlipEmpty: React.FC<IBetSlipEmptyProps> = ({ onClose }: IBetSlipEmptyProps) => {
  const betSlipEmptyClassName: string = `bet-slip-empty-section`;

  return (
    <Card className={cn(`${betSlipEmptyClassName}-container`, 'text-gray-400')}>
      <CardBody className={cn(`${betSlipEmptyClassName}-card`, 'p-4', 'text-center')}>
        <p className={cn(`${betSlipEmptyClassName}-title`, 'text-sm')}>Your bet slip is empty</p>
        <p className={cn(`${betSlipEmptyClassName}-text`, 'text-sm', 'mt-1')}>Select some odds to add to your slip</p>
        {onClose && (
          <Button
            variant="secondary"
            onClick={onClose}
            className={cn(`${betSlipEmptyClassName}-button`, 'mt-4')}
            size="sm"
          >
            Continue Browsing
          </Button>
        )}
      </CardBody>
    </Card>
  );
};

export default BetSlipEmpty;
