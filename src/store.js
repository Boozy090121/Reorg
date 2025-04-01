import { createStore, combineReducers } from 'redux';
import roleReducer from './features/roleSlice';
import phaseReducer from './features/phaseSlice';
import focusFactoryReducer from './features/focusFactorySlice';
import orgChartReducer from './features/orgChartSlice';

// Combine all reducers
const rootReducer = combineReducers({
  roles: roleReducer,
  phase: phaseReducer,
  focusFactory: focusFactoryReducer,
  orgChart: orgChartReducer,
  // Add other reducers here
});

// Create and export the store
const store = createStore(
  rootReducer,
  // Enable Redux DevTools if available
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store; 