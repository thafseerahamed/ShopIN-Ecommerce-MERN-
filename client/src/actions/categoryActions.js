import axios from "axios";
import {
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAIL,
    ALL_CATEGORY_FAIL,
    ALL_CATEGORY_REQUEST,
    ALL_CATEGORY_SUCCESS,
  } from "../constants/categoryConstants";

     //  Add new Category
export const createCategory = (category) => async (dispatch, getState) => {
    try {
      dispatch({ type: CREATE_CATEGORY_REQUEST });
  
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/v1/admin/category/new", category, config);
  
      dispatch({
        type: CREATE_CATEGORY_SUCCESS,
        payload: data.category
      });
    } catch (error) {
      dispatch({
        type: CREATE_CATEGORY_FAIL,
        payload: error.response.data.message,
      });
    }
  };


//  get all Categories
  
export const allCategory = () => async (dispatch) => {
  try {

      dispatch({ type: ALL_CATEGORY_REQUEST });

      const { data } = await axios.get('/api/v1/admin/categories')

      dispatch({
          type: ALL_CATEGORY_SUCCESS,
          payload: data.categories
      })

  } catch (error) {
      dispatch({
          type: ALL_CATEGORY_FAIL,
          payload: error.response.data.message
      })
  }
}


export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

