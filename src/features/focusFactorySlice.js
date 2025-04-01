// Focus Factory slice
const initialState = {
  currentFactory: 'ADD', // Default to 'ADD'
  factories: ['ADD', 'BBV', 'SYN']
};

// Action types
export const SET_CURRENT_FACTORY = 'SET_CURRENT_FACTORY';

// Action creators
export const setCurrentFactory = (factory) => ({
  type: SET_CURRENT_FACTORY,
  payload: factory
});

// Reducer
export default function focusFactoryReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_FACTORY:
      return {
        ...state,
        currentFactory: action.payload
      };
    default:
      return state;
  }
} 