import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { fetchVehicles } from '../services/api'
import type { Vehicle } from '../types/vehicle'
import type { SortOption } from '../types/sort'

interface VehicleState {
  items: Vehicle[]
  loading: boolean
  error: string | null
  query: string
  sort: SortOption
  selectedMake: string
  priceRange: string
  stockFilter: string
  page: number
}

const initialState: VehicleState = {
  items: [],
  loading: false,
  error: null,
  query: '',
  sort: 'price_asc',
  selectedMake: '',
  priceRange: '',
  stockFilter: '',
  page: 1,
}

export const loadVehicles = createAsyncThunk('vehicles/load', async () => {
  const res = await fetchVehicles()
  return res.products
})

const vehicleSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload
      state.page = 1
    },
    setSort(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload
      state.page = 1
    },
    setSelectedMake(state, action: PayloadAction<string>) {
      state.selectedMake = action.payload
      state.page = 1
    },
    setPriceRange(state, action: PayloadAction<string>) {
      state.priceRange = action.payload
      state.page = 1
    },
    setStockFilter(state, action: PayloadAction<string>) {
      state.stockFilter = action.payload
      state.page = 1
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    clearFilters(state) {
      state.query = ''
      state.selectedMake = ''
      state.priceRange = ''
      state.stockFilter = ''
      state.page = 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadVehicles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadVehicles.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(loadVehicles.rejected, (state) => {
        state.loading = false
        state.error = 'Failed to load vehicles. Please try again.'
      })
  },
})

export const {
  setQuery, setSort, setSelectedMake,
  setPriceRange, setStockFilter, setPage, clearFilters,
} = vehicleSlice.actions

export default vehicleSlice.reducer
