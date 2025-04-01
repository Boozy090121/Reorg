// Org Chart slice
const initialState = {
  orgCharts: {
    current: {
      ADD: { nodes: [], connections: [] },
      BBV: { nodes: [], connections: [] },
      SYN: { nodes: [], connections: [] }
    },
    future: {
      ADD: { nodes: [], connections: [] },
      BBV: { nodes: [], connections: [] },
      SYN: { nodes: [], connections: [] }
    }
  }
};

// Action types
export const UPDATE_ORG_CHART = 'UPDATE_ORG_CHART';

// Action creators
export const updateOrgChart = ({ phase, factory, orgChart }) => ({
  type: UPDATE_ORG_CHART,
  payload: { phase, factory, orgChart }
});

// Reducer
export default function orgChartReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ORG_CHART:
      const { phase, factory, orgChart } = action.payload;
      return {
        ...state,
        orgCharts: {
          ...state.orgCharts,
          [phase]: {
            ...state.orgCharts[phase],
            [factory]: orgChart
          }
        }
      };
    default:
      return state;
  }
} 