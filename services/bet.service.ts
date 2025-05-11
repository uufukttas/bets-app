import {
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { IBetProps, BetStatus, } from '@/types/bet';
import { ICartProps } from '@/types/cart';

export const placeBet = async (cart: ICartProps): Promise<string> => {
  try {
    if (!cart.items.length) {
      throw new Error('Your bet slip is empty');
    }

    if (!cart.totalStake || cart.totalStake <= 0) {
      throw new Error('Please enter a valid stake amount');
    }

    const betData: Omit<IBetProps, 'id'> = {
      userId: auth.currentUser.uid,
      items: cart.items,
      totalOdds: cart.totalOdds,
      stake: cart.totalStake,
      potentialWinnings: cart.potentialWinnings || 0,
      status: BetStatus.PENDING,
      createdAt: new Date()
    };

    const betRef = await addDoc(collection(db, 'bets'), {
      ...betData,
      createdAt: Timestamp.fromDate(betData.createdAt),
      items: cart.items.map(item => ({
        ...item,
        addedAt: Timestamp.fromDate(item.addedAt)
      }))
    });

    return betRef.id;
  } catch (error: any) {
    console.error('Error placing bet:', error);
    throw error;
  }
};
