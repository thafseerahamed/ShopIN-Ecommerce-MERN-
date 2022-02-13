import axios from "axios";
import {
  CREATE_ADDRESS_REQUEST,
  CREATE_ADDRESS_SUCCESS,
  CREATE_ADDRESS_FAIL,
  MY_ADDRESS_REQUEST,
  MY_ADDRESS_SUCCESS,
  MY_ADDRESS_FAIL,
  ADDRESS_DETAILS_REQUEST,
  ADDRESS_DETAILS_SUCCESS,
  ADDRESS_DETAILS_FAIL,
  DELETE_ADDRESS_REQUEST,
  DELETE_ADDRESS_SUCCESS,
  DELETE_ADDRESS_FAIL,
  UPDATE_ADDRESS_REQUEST,
  UPDATE_ADDRESS_SUCCESS,
  UPDATE_ADDRESS_FAIL,
  CLEAR_ERRORS,
} from "../constants/addressConstants";

export const myAddress = () => async (dispatch) => {
  try {
    dispatch({ type: MY_ADDRESS_REQUEST });

    const { data } = await axios.get("/api/v1/address/me");

    dispatch({
      type: MY_ADDRESS_SUCCESS,
      payload: data.shippingData,
    });
  } catch (error) {
    dispatch({
      type: MY_ADDRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

//  Add new address
export const createAddress = (address) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_ADDRESS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post("/api/v1/address/new", address, config);

    dispatch({
      type: CREATE_ADDRESS_SUCCESS,
      payload: data.shippingInfo,
    });
  } catch (error) {
    dispatch({
      type: CREATE_ADDRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get details of latest order address
export const orderAddressDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ADDRESS_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/v1/address/${id}`);

    dispatch({
      type: ADDRESS_DETAILS_SUCCESS,
      payload: data.shippingInfo,
    });
  } catch (error) {
    dispatch({
      type: ADDRESS_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete Address

export const deleteAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ADDRESS_REQUEST });

    const { data } = await axios.delete(`/api/v1/address/${id}`);

    dispatch({
      type: DELETE_ADDRESS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ADDRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Address
export const updateAddress = (id, addressData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ADDRESS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(
      `/api/v1/address/${id}`,
      addressData,
      config
    );

    dispatch({
      type: UPDATE_ADDRESS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ADDRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
