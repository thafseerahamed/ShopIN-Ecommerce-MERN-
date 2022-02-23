import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { addItemToCart, removeItemFromCart } from "../../actions/cartActions";
import {
  myAddress,
  clearErrors,
  orderAddressDetails,
} from "../../actions/addressActions";

const Cart = ({ history }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { cartItems } = useSelector((state) => state.cart);
  const {
    loading,
    error,
    shippingData = [],
  } = useSelector((state) => state.shippingData);
  const { isAuthenticated,  user} = useSelector((state) => state.user);
  const [radio, setRadio] = useState("");
  const removeCartItemHandler = (id, name) => {
    if (window.confirm(`Delete ${name} from Cart ?`)) {
      dispatch(removeItemFromCart(id));
    }
  };
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const itemDiscount = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.price*item.discountPrice)/100,
    0
  );
  const increaseQty = (id, quantity, stock) => {
    const newQty = quantity + 1;

    if (newQty > stock) return;

    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQty = (id, quantity) => {
    const newQty = quantity - 1;

    if (newQty <= 0) return;

    dispatch(addItemToCart(id, newQty));
  };

  const checkoutHandler = () => {
    if (radio === "") {
      history.push("/cart");
      alert.error("please select an address");
    } else {
      history.push(`/login?redirect=confirm/${radio}`);
    }
  };

  const submitHandler = () => {
    history.push("/address/me");
  };
  useEffect(() => {
  
    
    dispatch(myAddress());

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
history.push('/login')
    }
  }, [dispatch, alert, error]);

  return (
    <Fragment>
      {cartItems.length === 0 ? (
        <h2 className="mt-5">Your Cart is Empty</h2>
      ) : (
        <Fragment>
          <MetaData title={"Your Cart"} />
          <h2 className="mt-5">
            Your Cart: <b>{cartItems.length} items</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {cartItems.map((item) => (
                <div key={item.product}>
                  <hr />
                  <div className="cart-item">
                    <div className="row">
                      <div className="col-4 col-lg-3">
                        <img
                          src={item.image}
                          alt="Laptop"
                          height="90"
                          width="115"
                        />
                      </div>

                      <div className="col-5 col-lg-3">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p id="card_item_price">
                          ₹{" "}
                          {item.discountPrice === 0
                            ? item.price
                            : item.price - (item.discountPrice*item.price)/100}
                        </p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <div className="stockCounter d-inline">
                          <span
                            className="btn btn-danger minus"
                            onClick={() => {
                              decreaseQty(item.product, item.quantity);
                            }}
                          >
                            -
                          </span>
                          <input
                            type="Number"
                            className="form-control count d-inline"
                            value={item.quantity}
                            readOnly
                          />

                          <span
                            className="btn btn-primary plus"
                            onClick={() => {
                              increaseQty(
                                item.product,
                                item.quantity,
                                item.stock
                              );
                            }}
                          >
                            +
                          </span>
                        </div>
                      </div>

                      <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                        <i
                          id="delete_cart_item"
                          className="fa fa-trash btn btn-danger"
                          onClick={() =>
                            removeCartItemHandler(item.product, item.name)
                          }
                        ></i>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{" "}
                  <span className="order-summary-values">
                    {cartItems.reduce(
                      (acc, item) => acc + Number(item.quantity),
                      0
                    )}{" "}
                    (Units)
                  </span>
                </p>

                <p>
                  Est. total:{" "}
                  <span className="order-summary-values">
                    ₹
                    {cartItems
                      .reduce(
                        (acc, item) => acc + Number(item.quantity * item.price),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
                <p>
                  Discount total:{" "}
                  <span className="order-summary-values">
                    ₹
                    {cartItems
                      .reduce(
                        (acc, item) =>
                          acc +
                          Number(
                            (item.quantity *
                              (item.price * item.discountPrice)) /
                              100
                          ),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
                <p>
                  Net total:{" "}
                  <span className="order-summary-values">
                    ₹
                   {(itemsPrice-itemDiscount).toFixed(2)}
                  </span>
                </p>
                <hr />

                <button
                  id="checkout_btn"
                  className="btn btn-primary btn-block"
                  onClick={checkoutHandler}
                >
                  Check out
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <div className="row d-flex justify-content-between">
              <div className="col-12 col-lg-8  adress-details">
                <h4 className="mb-4">
                  <b>Addresses</b>
                </h4>
                {shippingData &&
                  shippingData.map((address) => (
                    <div key={address._id}>
                      <p>
                        <input
                          type="radio"
                          value={address._id}
                          onChange={(e) => setRadio(e.target.value)}
                          name="addressid"
                        />
                        <b className="ml-3">Phone:</b>
                        {address.phoneNo}
                      </p>

                      <p className="ml-4">
                        <b>Address:</b>
                        {address.address},{address.city},{address.postalCode},
                        {address.country}
                      </p>
                    </div>
                  ))}
                <button className="btn review-btn" onClick={submitHandler}>
                  Go to profile to add new Address
                </button>
              </div>
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
