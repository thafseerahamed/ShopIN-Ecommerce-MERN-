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
    DELETE_OFFER_RESET,
CLEAR_ERRORS} from "../constants/offerConstants";



export const newOfferReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_OFFER_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case CREATE_OFFER_SUCCESS:
        return {
          loading: false,
          offer: action.payload,
        };
      case CREATE_OFFER_FAIL:
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
  


  // Get All Offers
export const allOffersReducer = (state = { offers: [] }, action) => {
  switch (action.type) {

      case ALL_OFFERS_REQUEST:
          return {
              loading: true
          }

      case ALL_OFFERS_SUCCESS:
          return {
              loading: false,
              offers: action.payload
          }

      case ALL_OFFERS_FAIL:
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



export const offerReducer = (state = {}, action) => {
  switch (action.type) {

      // case UPDATE_PAYMENT_REQUEST:
      // case UPDATE_ORDER_REQUEST:
        case DELETE_OFFER_REQUEST:
          return {
              ...state,
              loading: true
          }


      // case UPDATE_ORDER_SUCCESS:
      //   case UPDATE_PAYMENT_SUCCESS:
      //     return {
      //         ...state,
      //         loading: false,
      //         isUpdated: action.payload
      //     }

          
      case DELETE_OFFER_SUCCESS:
        return {
            ...state,
            loading: false,
            isDeleted: action.payload
        }
      //   case UPDATE_PAYMENT_FAIL:
      // case UPDATE_ORDER_FAIL:
        case DELETE_OFFER_FAIL:
          return {
              ...state,
              error: action.payload
          }

    
      //     case UPDATE_PAYMENT_RESET:
      // case UPDATE_ORDER_RESET:
      //     return {
      //         ...state,
      //         isUpdated: false
      //     }

          case DELETE_OFFER_RESET:
            return {
                ...state,
                isDeleted: false
            }
      case CLEAR_ERRORS:
          return {
              ...state,
              error: null
          }

      default:
          return state
  }
}