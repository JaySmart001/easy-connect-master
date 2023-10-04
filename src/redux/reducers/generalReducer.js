import { SET_ALL, SET_CATEGORIES, SET_LISTINGS } from "../actions/constants";

const defaultState = {
  categories: [],
  listings: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_ALL:
      return { ...state, 
        categories: action.payload.categories,
        listings: action.payload.listings,
      };
    case SET_CATEGORIES:
      return { ...state, categories: action.payload };
    case SET_LISTINGS:
      return { ...state, listings: action.payload };
    default:
      return state;
  }
};
