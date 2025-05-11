import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { IEventProps, IOutcomeProps } from '@/types/event';
import { trackEvent, EventTypes } from '@/lib/firebase';
import { placeBet as submitBet } from '@/services/bet.service';

export interface CartItem {
  id: string;
  event: IEventProps;
  market: string;
  outcome: IOutcomeProps;
  bookmaker: string;
  addedAt: Date;
}

export interface BetSelection {
  eventId: string;
  eventName: string;
  marketKey: string;
  marketName: string;
  selectionName: string;
  odds: number;
  homeTeam: string;
  awayTeam: string;
}

interface CartState {
  items: CartItem[];
  totalOdds: number;
  totalStake: number;
  potentialWinnings: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalOdds: 1.0,
  totalStake: 0,
  potentialWinnings: 0,
  loading: false,
  error: null
};

const loadCartFromStorage = (): Partial<CartState> => {
  try {
    const savedCart = localStorage.getItem('betCart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage', error);
  }
  return {};
};

export const placeBet = createAsyncThunk(
  'cart/placeBet',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as { cart: CartState };
    const cart = state.cart;
    
    try {
      const betId = await submitBet({
        items: cart.items,
        totalOdds: cart.totalOdds,
        totalStake: cart.totalStake,
        potentialWinnings: cart.potentialWinnings
      });
      
      return betId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place bet. Please try again.');
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...initialState,
    ...loadCartFromStorage()
  },
  reducers: {
    addToBet: (state, action: PayloadAction<{
      event: IEventProps;
      market: string;
      outcome: IOutcomeProps;
      bookmaker: string;
    }>) => {
      const { event, market, outcome, bookmaker } = action.payload;
      
      const existingEventIndex = state.items.findIndex(
        item => item.event.id === event.id
      );
      
      const newItem: CartItem = {
        id: uuidv4(),
        event,
        market,
        outcome,
        bookmaker,
        addedAt: new Date()
      };

      if (existingEventIndex !== -1) {
        state.items[existingEventIndex] = newItem;
      } else {
        state.items.push(newItem);
      }

      state.totalOdds = state.items.reduce((acc, item) => acc * item.outcome.price, 1);
      state.potentialWinnings = state.totalOdds * state.totalStake;
      
      try {
        localStorage.setItem('betCart', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
      
      trackEvent(EventTypes.ADD_TO_CART, {
        eventId: event.id,
        market,
        selection: outcome.name,
        odds: outcome.price
      });
    },
    
    removeFromBet: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const itemToRemove = state.items.find(item => item.id === itemId);
      
      if (itemToRemove) {
        trackEvent(EventTypes.REMOVE_FROM_CART, {
          eventId: itemToRemove.event.id,
          selection: itemToRemove.outcome.name
        });
      }
      
      state.items = state.items.filter(item => item.id !== itemId);
      
      state.totalOdds = state.items.length > 0
        ? state.items.reduce((acc, item) => acc * item.outcome.price, 1)
        : 1.0;
        
      state.potentialWinnings = state.totalOdds * state.totalStake;
      
      try {
        localStorage.setItem('betCart', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    },
    
    clearCart: (state) => {
      trackEvent(EventTypes.CLEAR_CART, {
        itemCount: state.items.length
      });
      
      state.items = [];
      state.totalOdds = 1.0;
      state.potentialWinnings = 0;
      
      try {
        localStorage.setItem('betCart', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    },
    
    setStake: (state, action: PayloadAction<number>) => {
      state.totalStake = action.payload;
      state.potentialWinnings = state.totalOdds * action.payload;
      
      try {
        localStorage.setItem('betCart', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart to localStorage', error);
      }
    },
    
    addBet: (state, action: PayloadAction<BetSelection>) => {
      const selection = action.payload;
      const existingBetIndex = state.items.findIndex(
        item => item.event.id === selection.eventId
      );
      
      if (existingBetIndex !== -1) {
        console.warn('Using deprecated addBet action, consider switching to addToBet');
      }
    },
    
    removeBet: (state, action: PayloadAction<string>) => {
      const eventId = action.payload;
      const existingBetIndex = state.items.findIndex(
        item => item.event.id === eventId
      );
      
      if (existingBetIndex !== -1) {
        console.warn('Using deprecated removeBet action, consider switching to removeFromBet');
        state.items.splice(existingBetIndex, 1);
        
        state.totalOdds = state.items.length > 0
          ? state.items.reduce((acc, item) => acc * item.outcome.price, 1)
          : 1.0;
          
        state.potentialWinnings = state.totalOdds * state.totalStake;
      }
    },
    
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeBet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeBet.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalOdds = 1.0;
        state.potentialWinnings = 0;
        
        try {
          localStorage.setItem('betCart', JSON.stringify(state));
        } catch (error) {
          console.error('Failed to save cart to localStorage', error);
        }
      })
      .addCase(placeBet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to place bet';
      });
  }
});

export const { 
  addToBet, 
  removeFromBet, 
  clearCart, 
  setStake, 
  addBet,
  removeBet,
  clearError
} = cartSlice.actions;

export default cartSlice.reducer;
