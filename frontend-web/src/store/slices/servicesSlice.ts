import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  currency: string;
  images: string[];
  rating: number;
  reviewCount: number;
}

interface ServicesState {
  services: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  services: [],
  selectedService: null,
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
    },
    setSelectedService: (state, action: PayloadAction<Service>) => {
      state.selectedService = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setServices, setSelectedService, setLoading, setError } = servicesSlice.actions;
export default servicesSlice.reducer;
