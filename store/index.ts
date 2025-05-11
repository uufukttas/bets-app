import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sportsReducer from './slices/sportsSlice';
import eventsReducer from './slices/eventsSlice';
import cartReducer from './slices/cartSlice';

const rootReducer = combineReducers({
  sports: sportsReducer,
  events: eventsReducer,
  cart: cartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
