import { SET_ALL, SET_CATEGORIES, SET_LISTINGS } from "../actions/constants";
import generalApi from "../api/general";

export const fetchAll = () => {
  return async (dispatch) => {
    try {
      const categories = await generalApi.fetchCategories();
      const listings = await generalApi.fetchListings();
      const payload = {
        categories, listings
      }
      await dispatch({
        type: SET_ALL,
        payload: payload,
      });
      return Promise.resolve(payload);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchListings = () => {
  return async (dispatch) => {
    try {
      const listings = await generalApi.fetchListings();

      await dispatch({
        type: SET_LISTINGS,
        payload: listings,
      });
      return Promise.resolve(listings);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const fetchCategories = () => {
  return async (dispatch) => {
    try {
      const categories = await generalApi.fetchCategories();

      await dispatch({
        type: SET_CATEGORIES,
        payload: categories,
      });
      return Promise.resolve(categories);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};


