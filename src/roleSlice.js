import { createSlice } from '@reduxjs/toolkit';

// Initial state with empty roles for each factory
const initialState = {
  roles: {
    ADD: [],
    BBV: [],
    SYN: []
  },
  currentRole: null
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    // Set current role
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
    },
    
    // Add a new role
    addRole: (state, action) => {
      const { factory, role } = action.payload;
      if (!state.roles[factory]) {
        state.roles[factory] = [];
      }
      state.roles[factory].push(role);
    },
    
    // Update an existing role
    updateRole: (state, action) => {
      const { factory, roleId, updatedRole } = action.payload;
      if (state.roles[factory]) {
        const index = state.roles[factory].findIndex(role => role.id === roleId);
        if (index !== -1) {
          state.roles[factory][index] = {
            ...state.roles[factory][index],
            ...updatedRole
          };
        }
      }
    },
    
    // Remove a role
    removeRole: (state, action) => {
      const { factory, roleId } = action.payload;
      if (state.roles[factory]) {
        state.roles[factory] = state.roles[factory].filter(role => role.id !== roleId);
      }
    }
  },
});

// Export actions
export const { 
  setCurrentRole, 
  addRole, 
  updateRole, 
  removeRole 
} = roleSlice.actions;

// Export reducer
export default roleSlice.reducer;
