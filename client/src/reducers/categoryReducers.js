import {
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  CREATE_CATEGORY_FAIL,
  ALL_CATEGORY_FAIL,
  ALL_CATEGORY_REQUEST,
  ALL_CATEGORY_SUCCESS,
  CLEAR_ERRORS 
} from "../constants/categoryConstants";

export const newCategoryReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case CREATE_CATEGORY_SUCCESS:
      return {
        loading: false,
        newCategory: action.payload,
      };
    case CREATE_CATEGORY_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};



export const allCategoryReducer = (state = { categories: [] }, action) => {
  switch (action.type) {

      case ALL_CATEGORY_REQUEST:
          return {
              loading: true
          }

      case ALL_CATEGORY_SUCCESS:
          return {
              loading: false,
              categories: action.payload
          }

      case ALL_CATEGORY_FAIL:
          return {
              loading: false,
              error: action.payload
          }
      case CLEAR_ERRORS:
          return {
              ...state,
              error: null
          }

      default:
          return state;
  }
}
