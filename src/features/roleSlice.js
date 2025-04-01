// Role slice with basic CRUD operations
const initialState = {
  roles: {},
  currentRole: null
};

// Action types
export const ADD_ROLE = 'ADD_ROLE';
export const UPDATE_ROLE = 'UPDATE_ROLE';
export const REMOVE_ROLE = 'REMOVE_ROLE';
export const SET_CURRENT_ROLE = 'SET_CURRENT_ROLE';

// Action creators
export const addRole = (role) => ({
  type: ADD_ROLE,
  payload: role
});

export const updateRole = (roleId, role) => ({
  type: UPDATE_ROLE,
  payload: { id: roleId, role }
});

export const removeRole = (roleId) => ({
  type: REMOVE_ROLE,
  payload: roleId
});

export const setCurrentRole = (roleId) => ({
  type: SET_CURRENT_ROLE,
  payload: roleId
});

// Reducer
export default function roleReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ROLE:
      return {
        ...state,
        roles: {
          ...state.roles,
          [action.payload.id]: action.payload
        }
      };
    case UPDATE_ROLE:
      return {
        ...state,
        roles: {
          ...state.roles,
          [action.payload.id]: {
            ...state.roles[action.payload.id],
            ...action.payload.role
          }
        }
      };
    case REMOVE_ROLE:
      const newRoles = { ...state.roles };
      delete newRoles[action.payload];
      return {
        ...state,
        roles: newRoles
      };
    case SET_CURRENT_ROLE:
      return {
        ...state,
        currentRole: action.payload
      };
    default:
      return state;
  }
} 