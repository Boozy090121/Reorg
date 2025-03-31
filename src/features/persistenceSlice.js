import { createSlice } from '@reduxjs/toolkit';

// Helper function to load state from localStorage
// eslint-disable-next-line no-unused-vars
const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return defaultValue;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading from localStorage:', err);
    return defaultValue;
  }
};

// Helper function to save state to localStorage
const saveToLocalStorage = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

const persistenceSlice = createSlice({
  name: 'persistence',
  initialState: {
    lastSaved: null,
    autoSaveEnabled: true,
    autoSaveInterval: 60000, // 1 minute in milliseconds
    saveInProgress: false,
    saveError: null,
    loadError: null
  },
  reducers: {
    setSaveTimestamp: (state, action) => {
      state.lastSaved = action.payload;
    },
    toggleAutoSave: (state) => {
      state.autoSaveEnabled = !state.autoSaveEnabled;
    },
    setAutoSaveInterval: (state, action) => {
      state.autoSaveInterval = action.payload;
    },
    setSaveInProgress: (state, action) => {
      state.saveInProgress = action.payload;
    },
    setSaveError: (state, action) => {
      state.saveError = action.payload;
    },
    setLoadError: (state, action) => {
      state.loadError = action.payload;
    }
  }
});

export const {
  setSaveTimestamp,
  toggleAutoSave,
  setAutoSaveInterval,
  setSaveInProgress,
  setSaveError,
  setLoadError
} = persistenceSlice.actions;

// Thunk to save all application state to localStorage
export const saveAppState = () => (dispatch, getState) => {
  try {
    dispatch(setSaveInProgress(true));
    
    const state = getState();
    
    // Save each slice of state separately
    saveToLocalStorage('phase', state.phase);
    saveToLocalStorage('roles', state.roles);
    saveToLocalStorage('personnel', state.personnel);
    saveToLocalStorage('orgChart', state.orgChart);
    saveToLocalStorage('focusFactory', state.focusFactory);
    
    // Update last saved timestamp
    const timestamp = new Date().toISOString();
    dispatch(setSaveTimestamp(timestamp));
    
    dispatch(setSaveInProgress(false));
    dispatch(setSaveError(null));
  } catch (error) {
    console.error('Error saving application state:', error);
    dispatch(setSaveInProgress(false));
    dispatch(setSaveError(error.message));
  }
};

// Thunk to load all application state from localStorage
export const loadAppState = () => (dispatch, getState) => {
  try {
    // Load state is handled by individual reducers in their initialState
    // This thunk is primarily for error handling and future expansion
    
    dispatch(setLoadError(null));
  } catch (error) {
    console.error('Error loading application state:', error);
    dispatch(setLoadError(error.message));
  }
};

export default persistenceSlice.reducer;
