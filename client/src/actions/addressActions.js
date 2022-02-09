import axios from "axios";
import { 
    CREATE_ADDRESS_REQUEST,
    CREATE_ADDRESS_SUCCESS,
    CREATE_ADDRESS_FAIL,
    MY_ADDRESS_REQUEST,
    MY_ADDRESS_SUCCESS,
    MY_ADDRESS_FAIL,
CLEAR_ERRORS} from "../constants/addressConstants";



export const myAddress = () => async (dispatch) => {
        try {
      
            dispatch({ type: MY_ADDRESS_REQUEST });
      
            const { data } = await axios.get('/api/v1/address/me')
      
            dispatch({
                type: MY_ADDRESS_SUCCESS,
                payload: data.shippingData
            })
      
        } catch (error) {
            dispatch({
                type: MY_ADDRESS_FAIL,
                payload: error.response.data.message
            })
        }
      }




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
        payload: data.shippingInfo
      });
    } catch (error) {
      dispatch({
        type: CREATE_ADDRESS_FAIL,
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
  