import generalReducer from "./generalReducer";
import userReducer from "./userReducer";

const rootReducer = {
  user: userReducer,
  general: generalReducer,
};

export default rootReducer;
