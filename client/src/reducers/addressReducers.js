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
    DELETE_ADDRESS_RESET,
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_RESET,
    UPDATE_ADDRESS_FAIL,
CLEAR_ERRORS} from "../constants/addressConstants";







export const newAddressReducer = (state = {}, action) => {
    switch (action.type) {
      case CREATE_ADDRESS_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case CREATE_ADDRESS_SUCCESS:
        return {
          loading: false,
          shippingInfo: action.payload,
        };
      case CREATE_ADDRESS_FAIL:
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
  



export const myAddressReducer = (state = { shippingData: [] }, action) => {
    switch (action.type) {
  
        case MY_ADDRESS_REQUEST:
            return {
                loading: true
            }
  
        case MY_ADDRESS_SUCCESS:
            return {
                loading: false,
                shippingData: action.payload
            }
  
        case MY_ADDRESS_FAIL:
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
  

  export const addressDetailsReducer = (state = {}, action) => {
    switch (action.type) {
  
      case ADDRESS_DETAILS_REQUEST:
        return {
          loading: true,
        };
      case ADDRESS_DETAILS_SUCCESS:
        return {
          loading: false,
          orderAddress: action.payload,
        };
      case ADDRESS_DETAILS_FAIL:
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
  

  
export const addressReducer = (state = {}, action) => {
  switch (action.type) {


      case UPDATE_ADDRESS_REQUEST:
        case DELETE_ADDRESS_REQUEST:
          return {
              ...state,
              loading: true
          }


      case UPDATE_ADDRESS_SUCCESS:

          return {
              ...state,
              loading: false,
              isUpdated: action.payload
          }

          
      case DELETE_ADDRESS_SUCCESS:
        return {
            ...state,
            loading: false,
            isDeleted: action.payload
        }

      case UPDATE_ADDRESS_FAIL:
        case DELETE_ADDRESS_FAIL:
          return {
              ...state,
              error: action.payload
          }


      case UPDATE_ADDRESS_RESET:
          return {
              ...state,
              isUpdated: false
          }

          case DELETE_ADDRESS_RESET:
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