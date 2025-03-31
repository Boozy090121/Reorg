import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  roles: {
    // Sample roles for each factory
    ADD: [
      {
        id: 'add-qm-1',
        title: 'Quality Manager',
        department: 'Quality Control',
        responsibilities: [
          'Oversee quality operations for injectables',
          'Develop quality policies',
          'Manage quality team',
          'Report to ADD Quality Head'
        ],
        requiredSkills: [
          'Quality management systems',
          'Team leadership',
          'Process improvement',
          'Regulatory compliance'
        ]
      },
      {
        id: 'add-qe-1',
        title: 'Quality Engineer',
        department: 'Quality Control',
        responsibilities: [
          'Perform quality testing for injectable products',
          'Document test results',
          'Identify quality issues',
          'Implement corrective actions'
        ],
        requiredSkills: [
          'Quality control procedures',
          'Statistical analysis',
          'Documentation',
          'Problem-solving'
        ]
      }
    ],
    BBV: [
      {
        id: 'bbv-qm-1',
        title: 'Quality Manager',
        department: 'Quality Control',
        responsibilities: [
          'Oversee quality operations for bottles and blisters',
          'Develop quality policies',
          'Manage quality team',
          'Report to BBV Quality Head'
        ],
        requiredSkills: [
          'Quality management systems',
          'Team leadership',
          'Process improvement',
          'Regulatory compliance'
        ]
      },
      {
        id: 'bbv-qe-1',
        title: 'Quality Engineer',
        department: 'Quality Control',
        responsibilities: [
          'Perform quality testing for bottle and blister products',
          'Document test results',
          'Identify quality issues',
          'Implement corrective actions'
        ],
        requiredSkills: [
          'Quality control procedures',
          'Statistical analysis',
          'Documentation',
          'Problem-solving'
        ]
      }
    ],
    SYN: [
      {
        id: 'syn-qm-1',
        title: 'Quality Manager',
        department: 'Quality Control',
        responsibilities: [
          'Oversee quality operations for syringes',
          'Develop quality policies',
          'Manage quality team',
          'Report to SYN Quality Head'
        ],
        requiredSkills: [
          'Quality management systems',
          'Team leadership',
          'Process improvement',
          'Regulatory compliance'
        ]
      },
      {
        id: 'syn-qe-1',
        title: 'Quality Engineer',
        department: 'Quality Control',
        responsibilities: [
          'Perform quality testing for syringe products',
          'Document test results',
          'Identify quality issues',
          'Implement corrective actions'
        ],
        requiredSkills: [
          'Quality control procedures',
          'Statistical analysis',
          'Documentation',
          'Problem-solving'
        ]
      }
    ]
  }
};

export const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    addRole: (state, action) => {
      const { factory, role } = action.payload;
      state.roles[factory].push(role);
    },
    updateRole: (state, action) => {
      const { factory, roleId, updatedRole } = action.payload;
      const index = state.roles[factory].findIndex(role => role.id === roleId);
      if (index !== -1) {
        state.roles[factory][index] = { ...state.roles[factory][index], ...updatedRole };
      }
    },
    removeRole: (state, action) => {
      const { factory, roleId } = action.payload;
      state.roles[factory] = state.roles[factory].filter(role => role.id !== roleId);
    }
  },
});

export const { addRole, updateRole, removeRole } = roleSlice.actions;

export default roleSlice.reducer;
