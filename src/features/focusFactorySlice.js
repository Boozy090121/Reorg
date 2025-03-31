import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentFactory: 'ADD', // 'ADD', 'BBV', or 'SYN'
  factories: {
    ADD: {
      name: 'Advanced Drug Delivery',
      description: 'Focus factory for injectable, implant, and patch drug delivery systems',
      roles: [], // Will contain role IDs specific to this factory
      orgStructure: {} // Will contain org chart structure specific to this factory
    },
    BBV: {
      name: 'Bottles, Blisters, Vials',
      description: 'Focus factory for traditional pharmaceutical packaging',
      roles: [],
      orgStructure: {}
    },
    SYN: {
      name: 'Syringes & Sterilization',
      description: 'Focus factory for syringe manufacturing and sterilization processes',
      roles: [],
      orgStructure: {}
    }
  }
};

export const focusFactorySlice = createSlice({
  name: 'focusFactory',
  initialState,
  reducers: {
    setCurrentFactory: (state, action) => {
      state.currentFactory = action.payload;
    },
    updateFactoryRoles: (state, action) => {
      const { factory, roles } = action.payload;
      state.factories[factory].roles = roles;
    },
    updateFactoryOrgStructure: (state, action) => {
      const { factory, orgStructure } = action.payload;
      state.factories[factory].orgStructure = orgStructure;
    }
  },
});

export const { setCurrentFactory, updateFactoryRoles, updateFactoryOrgStructure } = focusFactorySlice.actions;

export default focusFactorySlice.reducer;
