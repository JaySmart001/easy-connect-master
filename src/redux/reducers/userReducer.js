import { USER_LOGOUT, USER_LOGIN, USER_UPDATE } from "../actions/constants";

const userData = JSON.parse(localStorage.getItem("easy-connect-ng"));

const defaultState = {
  authenticated: !!userData,
  userData: userData,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOGOUT:
      return defaultState;
    case USER_LOGIN:
      return { ...state, authenticated: true, userData: action.payload };
    case USER_UPDATE:
      return { ...state, userData: action.payload };
    default:
      return state;
  }
};
