import { ICartItemProps } from './cart';

export enum BetStatus {
  PENDING = 'pending',
  WON = 'won',
  LOST = 'lost',
  VOIDED = 'voided'
}

export interface IBetProps {
  id: string;
  userId: string;
  items: ICartItemProps[];
  totalOdds: number;
  stake: number;
  potentialWinnings: number;
  status: BetStatus;
  createdAt: Date;
  settledAt?: Date;
}

export interface IBetHistoryFiltersProps {
  status?: BetStatus;
  startDate?: Date;
  endDate?: Date;
} 