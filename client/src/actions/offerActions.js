import axios from "axios";

import { 
    CREATE_OFFER_REQUEST,
    CREATE_OFFER_SUCCESS,
    CREATE_OFFER_FAIL,
    ALL_OFFERS_REQUEST,
    ALL_OFFERS_SUCCESS,
    ALL_OFFERS_FAIL,
    DELETE_OFFER_REQUEST,
    DELETE_OFFER_SUCCESS,
    DELETE_OFFER_FAIL,

    
CLEAR_ERRORS} from "../constants/offerConstants";


    //  Add new Offer
    export const createOffer = (offer) => async (dispatch, getState) => {
        try {
          dispatch({ type: CREATE_OFFER_REQUEST });
      
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const { data } = await axios.post("/api/v1/admin/offer/new", offer, config);
      
          dispatch({
            type: CREATE_OFFER_SUCCESS,
            payload: data.offer
          });
        } catch (error) {
          dispatch({
            type: CREATE_OFFER_FAIL,
            payload: error.response.data.message,
          });
        }
      };
    


      export const allOffers = () => async (dispatch) => {
        try {
      
            dispatch({ type: ALL_OFFERS_REQUEST });
      
            const { data } = await axios.get('/api/v1/admin/offers')
      
            dispatch({
                type: ALL_OFFERS_SUCCESS,
                payload: data.offers
            })
      
        } catch (error) {
            dispatch({
                type: ALL_OFFERS_FAIL,
                payload: error.response.data.message
            })
        }
      }




      
// delete offer

export const deleteOffer = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_OFFER_REQUEST });

   
    const { data } = await axios.delete(`/api/v1/admin/offer/delete/${id}`);

    dispatch({
      type: DELETE_OFFER_SUCCESS,
      payload: data.success
    });
  } catch (error) {
    dispatch({
      type: DELETE_OFFER_FAIL,
      payload: error.response.data.message,
    });
  }
};


      
export const clearErrors = () => async (dispatch) => {
    dispatch({
      type: CLEAR_ERRORS,
    });
  };
  
  