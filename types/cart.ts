import { IOutcomeProps, IEventProps } from './event';

export interface ICartItemProps {
  id: string;
  event: IEventProps;
  market: string;
  outcome: IOutcomeProps;
  bookmaker: string;
  addedAt: Date;
}

export interface ICartProps {
  items: ICartItemProps[];
  totalOdds: number;
  totalStake?: number;
  potentialWinnings?: number;
}

export type CartAction = 
  | { type: 'ADD_TO_CART'; item: ICartItemProps }
  | { type: 'REMOVE_FROM_CART'; id: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STAKE'; amount: number };
