import { createSlice } from '@reduxjs/toolkit'

const repositorySlice = createSlice({
  name: 'repositories',

  initialState: {
    items: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    selectedPeriod: 7,
  },

  reducers: {
    fetchRepositoriesRequest: state => {
      state.loading = true
      state.error = null
    },

    fetchRepositoriesSuccess: (state, action) => {
      state.loading = false

      if (action.payload.page === 1) {
        state.items = action.payload.items
      } else {
        state.items.push(...action.payload.items)
      }

      state.page = action.payload.page
      state.hasMore = action.payload.hasMore
    },

    fetchRepositoriesFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
    },

    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload
      state.page = 1
      state.items = []
      state.hasMore = true
    },
  },
})

export const {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setSelectedPeriod,
} = repositorySlice.actions

export default repositorySlice.reducer