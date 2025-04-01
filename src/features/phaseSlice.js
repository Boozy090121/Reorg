// Phase slice
const initialState = {
  currentPhase: 'current', // Default to 'current'
  phases: ['current', 'future']
};

// Action types
export const SET_CURRENT_PHASE = 'SET_CURRENT_PHASE';

// Action creators
export const setCurrentPhase = (phase) => ({
  type: SET_CURRENT_PHASE,
  payload: phase
});

// Reducer
export default function phaseReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_PHASE:
      return {
        ...state,
        currentPhase: action.payload
      };
    default:
      return state;
  }
} 