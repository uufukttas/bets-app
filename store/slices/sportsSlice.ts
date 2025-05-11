import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getSports } from '@/services/sports.service';
import { ISportProps } from '@/types/sport';

interface Sport extends ISportProps {
  id?: string;
  name?: string;
  category?: string;
  icon?: string;
}

interface SportsState {
  sports: Sport[];
  loading: boolean;
  error: string | null;
}

const initialState: SportsState = {
  sports: [],
  loading: false,
  error: null,
};

export const fetchSports = createAsyncThunk(
  'sports/getSports', 
  async (_, { rejectWithValue }) => {
    try {
      return await getSports();
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        return rejectWithValue('API key is missing or invalid. Please check your API key configuration.');
      }
      
      return rejectWithValue(error.message || 'Failed to fetch sports data');
    }
  }
);

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    clearSportsError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSports.fulfilled, (state, action: PayloadAction<Sport[]>) => {
        state.sports = action.payload;
        state.loading = false;
      })
      .addCase(fetchSports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch sports';
      });
  },
});

export const { clearSportsError } = sportsSlice.actions;
export default sportsSlice.reducer; 