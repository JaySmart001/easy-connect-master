import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const DEV = process.env.NODE_ENV !== "production";


let middleware = [thunk];
let composeEnhancers = compose;

if (DEV) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

let composers = [applyMiddleware(...middleware)];

const initStore = (initialState) => {
  const reducer = combineReducers(rootReducer);
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(...composers)
  );
  return store;
};

export default initStore;
