import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPhase: 'current', // 'current', 'future', or 'iterative'
  phases: {
    current: {
      name: 'Current State',
      lastModified: new Date().toISOString(),
    },
    future: {
      name: 'Future State',
      lastModified: null,
    },
    iterative: {
      name: 'Iterative Phase',
      lastModified: null,
    }
  }
};

export const phaseSlice = createSlice({
  name: 'phase',
  initialState,
  reducers: {
    setCurrentPhase: (state, action) => {
      state.currentPhase = action.payload;
    },
    updatePhaseLastModified: (state, action) => {
      const { phase } = action.payload;
      state.phases[phase].lastModified = new Date().toISOString();
    },
  },
});

export const { setCurrentPhase, updatePhaseLastModified } = phaseSlice.actions;

export default phaseSlice.reducer;
