import { configureStore } from '@reduxjs/toolkit';
import phaseReducer from './features/phaseSlice';
import roleReducer from './features/roleSlice';
import personnelReducer from './features/personnelSlice';
import orgChartReducer from './features/orgChartSlice';
import focusFactoryReducer from './features/focusFactorySlice';
import persistenceReducer from './features/persistenceSlice';

const store = configureStore({
  reducer: {
    phase: phaseReducer,
    roles: roleReducer,
    personnel: personnelReducer,
    orgChart: orgChartReducer,
    focusFactory: focusFactoryReducer,
    persistence: persistenceReducer,
  },
});

export default store;
