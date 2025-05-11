import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvents } from '@/services/events.service';

interface EventsState {
  events: any[];
  loading: boolean;
  error: string | null;
  selectedSportId: string | null;
}

const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
  selectedSportId: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (sportId: string, { rejectWithValue }) => {
    try {
      const data = await getEvents(sportId);
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch events');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setSelectedSportId: (state, action: PayloadAction<string | null>) => {
      state.selectedSportId = action.payload;
    },
    clearEvents: (state) => {
      state.events = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
        state.loading = false;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch events';
      });
  },
});

export const { setSelectedSportId, clearEvents } = eventsSlice.actions;
export default eventsSlice.reducer; 