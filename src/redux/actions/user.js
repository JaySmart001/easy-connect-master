import { USER_LOGIN, USER_LOGOUT, USER_UPDATE } from "./constants";
import user from "../api/user";

export const loginUser = (payload, checked) => {
  return async (dispatch) => {
    try {
      const response = await user.loginUser(payload);
      if(response) {
        const userData = await (await user.getUserData(payload.email)).data();
        localStorage.setItem("easy-connect-ng", JSON.stringify(userData));
        await dispatch({
          type: USER_LOGIN,
          payload: userData,
        });
        return Promise.resolve(userData);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const updateUser = (payload) => {
  return async (dispatch) => {
    try {
        await user.updateUser(payload)
        const userData = (await user.getUserData(payload.email)).data();
        localStorage.setItem("easy-connect-ng", JSON.stringify(userData));
        await dispatch({
          type: USER_UPDATE,
          payload: userData,
        });
        return Promise.resolve(userData);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    try {
      localStorage.removeItem("easy-connect-ng");
      const res = await user.logoutUser();
      await dispatch({
        type: USER_LOGOUT
      });
      return Promise.resolve(res);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };
};
