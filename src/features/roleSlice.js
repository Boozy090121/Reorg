// Placeholder for roleSlice
export const setCurrentRole = (role) => ({
  type: 'SET_CURRENT_ROLE',
  payload: role
});

const initialState = {
  roles: {}
};

export default function roleSlice(state = initialState, action) {
  switch (action.type) {
    case 'SET_CURRENT_ROLE':
      return {
        ...state,
        currentRole: action.payload
      };
    default:
      return state;
  }
} 