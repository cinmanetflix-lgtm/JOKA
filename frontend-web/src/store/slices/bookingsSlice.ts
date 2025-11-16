import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Booking {
  id: string;
  serviceId: string;
  bookingDate: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

interface BookingsState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  loading: false,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<Booking[]>) => {
      state.bookings = action.payload;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setBookings, setCurrentBooking, setLoading } = bookingsSlice.actions;
export default bookingsSlice.reducer;
