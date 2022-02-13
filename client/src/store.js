import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  newProductReducer,
  productDetailsReducer,
  productsReducer,
  productReducer
} from "./reducers/productReducers";
import {
  userReducer,
  profileReducer,
  forgotPasswordReducer,
  allUsersReducer,
  userDetailsReducer
} from "./reducers/userReducers";
import { cartReducer } from "./reducers/cartReducers";
import { myOrdersReducer, newOrderReducer, orderDetailsReducer,allOrdersReducer,orderReducer} from "./reducers/orderReducers";
import { addressDetailsReducer, addressReducer, myAddressReducer, newAddressReducer } from "./reducers/addressReducers";
import { allCategoryReducer, newCategoryReducer } from "./reducers/categoryReducers";
import { allOffersReducer, newOfferReducer, offerReducer } from "./reducers/offerReducers";


const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  user: userReducer,
  allUsers:allUsersReducer,
  userDetails: userDetailsReducer,
  profile: profileReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder:newOrderReducer,
  myOrders:myOrdersReducer,
  orderDetails: orderDetailsReducer,
  order:orderReducer,
  allOrders:allOrdersReducer,
  shippingData:myAddressReducer,
  shippingInfo:newAddressReducer,
  orderAddress: addressDetailsReducer,
  updateAddress:addressReducer,
  newCategory:newCategoryReducer,
  allCategories:allCategoryReducer,
  newOffer: newOfferReducer,
  allOffers: allOffersReducer,
  offer:offerReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
      shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {}
  },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
