import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Org chart data for each factory and phase
  orgCharts: {
    current: {
      ADD: {
        nodes: [
          {
            id: 'add-head-1',
            roleId: 'add-head',
            title: 'ADD Quality Head',
            personId: 'person-3',
            parentId: null,
            position: { x: 400, y: 50 }
          },
          {
            id: 'add-qm-inj-1',
            roleId: 'add-qm-1',
            title: 'Quality Manager - Injectables',
            personId: 'person-2',
            parentId: 'add-head-1',
            position: { x: 200, y: 150 }
          },
          {
            id: 'add-qe-1-1',
            roleId: 'add-qe-1',
            title: 'Quality Engineer - Team 1',
            personId: 'person-1',
            parentId: 'add-qm-inj-1',
            position: { x: 100, y: 250 }
          }
        ],
        connections: [
          { source: 'add-head-1', target: 'add-qm-inj-1' },
          { source: 'add-qm-inj-1', target: 'add-qe-1-1' }
        ]
      },
      BBV: {
        nodes: [
          {
            id: 'bbv-head-1',
            roleId: 'bbv-head',
            title: 'BBV Quality Head',
            personId: null,
            parentId: null,
            position: { x: 400, y: 50 }
          },
          {
            id: 'bbv-qm-1-1',
            roleId: 'bbv-qm-1',
            title: 'Quality Manager - Bottles',
            personId: null,
            parentId: 'bbv-head-1',
            position: { x: 200, y: 150 }
          },
          {
            id: 'bbv-qe-1-1',
            roleId: 'bbv-qe-1',
            title: 'Quality Engineer - Team 1',
            personId: 'person-4',
            parentId: 'bbv-qm-1-1',
            position: { x: 100, y: 250 }
          }
        ],
        connections: [
          { source: 'bbv-head-1', target: 'bbv-qm-1-1' },
          { source: 'bbv-qm-1-1', target: 'bbv-qe-1-1' }
        ]
      },
      SYN: {
        nodes: [
          {
            id: 'syn-head-1',
            roleId: 'syn-head',
            title: 'SYN Quality Head',
            personId: null,
            parentId: null,
            position: { x: 400, y: 50 }
          },
          {
            id: 'syn-qm-1-1',
            roleId: 'syn-qm-1',
            title: 'Quality Manager - Syringes',
            personId: null,
            parentId: 'syn-head-1',
            position: { x: 200, y: 150 }
          },
          {
            id: 'syn-qe-1-1',
            roleId: 'syn-qe-1',
            title: 'Quality Engineer - Team 1',
            personId: 'person-6',
            parentId: 'syn-qm-1-1',
            position: { x: 100, y: 250 }
          }
        ],
        connections: [
          { source: 'syn-head-1', target: 'syn-qm-1-1' },
          { source: 'syn-qm-1-1', target: 'syn-qe-1-1' }
        ]
      }
    },
    future: {
      ADD: { nodes: [], connections: [] },
      BBV: { nodes: [], connections: [] },
      SYN: { nodes: [], connections: [] }
    },
    iterative: {
      ADD: { nodes: [], connections: [] },
      BBV: { nodes: [], connections: [] },
      SYN: { nodes: [], connections: [] }
    }
  }
};

export const orgChartSlice = createSlice({
  name: 'orgChart',
  initialState,
  reducers: {
    addNode: (state, action) => {
      const { phase, factory, node } = action.payload;
      state.orgCharts[phase][factory].nodes.push(node);
    },
    updateNode: (state, action) => {
      const { phase, factory, nodeId, updatedNode } = action.payload;
      const index = state.orgCharts[phase][factory].nodes.findIndex(node => node.id === nodeId);
      if (index !== -1) {
        state.orgCharts[phase][factory].nodes[index] = { 
          ...state.orgCharts[phase][factory].nodes[index], 
          ...updatedNode 
        };
      }
    },
    removeNode: (state, action) => {
      const { phase, factory, nodeId } = action.payload;
      state.orgCharts[phase][factory].nodes = state.orgCharts[phase][factory].nodes.filter(
        node => node.id !== nodeId
      );
      // Also remove any connections involving this node
      state.orgCharts[phase][factory].connections = state.orgCharts[phase][factory].connections.filter(
        conn => conn.source !== nodeId && conn.target !== nodeId
      );
    },
    addConnection: (state, action) => {
      const { phase, factory, connection } = action.payload;
      state.orgCharts[phase][factory].connections.push(connection);
    },
    removeConnection: (state, action) => {
      const { phase, factory, sourceId, targetId } = action.payload;
      state.orgCharts[phase][factory].connections = state.orgCharts[phase][factory].connections.filter(
        conn => !(conn.source === sourceId && conn.target === targetId)
      );
    },
    assignPersonToNode: (state, action) => {
      const { phase, factory, nodeId, personId } = action.payload;
      const index = state.orgCharts[phase][factory].nodes.findIndex(node => node.id === nodeId);
      if (index !== -1) {
        state.orgCharts[phase][factory].nodes[index].personId = personId;
      }
    },
    copyOrgChart: (state, action) => {
      const { sourcePhase, targetPhase, factory } = action.payload;
      state.orgCharts[targetPhase][factory] = JSON.parse(JSON.stringify(state.orgCharts[sourcePhase][factory]));
    }
  },
});

export const { 
  addNode, 
  updateNode, 
  removeNode, 
  addConnection, 
  removeConnection, 
  assignPersonToNode,
  copyOrgChart
} = orgChartSlice.actions;

export default orgChartSlice.reducer;
