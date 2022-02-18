import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrderDetails,
  updateOrder,
  clearErrors,
  updatePayment,
} from "../../actions/orderActions";
import Sidebar from "./Sidebar";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

const ProcessOrder = ({ match }) => {
  const [orderstatus, setOrderStatus] = useState("");
  const [paymentstatus, setPaymentStatus] = useState("not completed");

  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, order = {} } = useSelector((state) => state.orderDetails);
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;
  const { error, isUpdated } = useSelector((state) => state.order);
  const orderId = match.params.id;

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }


    if (isUpdated) {
      alert.success("order updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
  }, [dispatch, alert, error, isUpdated, orderId]);

  const updateOrderHandler = (id) => {
    const formData = new FormData();
    formData.set("orderstatus", orderstatus);

    dispatch(updateOrder(id, formData));
  };
  const updatePaymentHandler = (id) => {
    const formData = new FormData()
    formData.set("paymentstatus", paymentstatus);

    dispatch(updatePayment(id, formData));
  };
  const shippingDetails =
    shippingInfo &&
    `${shippingInfo.address},${shippingInfo.city},${shippingInfo.postalCode},
                         ${shippingInfo.country}`;

  const isPaid =
    paymentInfo && paymentInfo.status === "succeeded" ? true : false;
  return (
    <div>
      <MetaData title={`Process Order # ${order && order._id}`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <div>
            {loading ? (
              <Loader />
            ) : (
              <div className="row d-flex justify-content-around">
                <div className="col-12 col-lg-7 order-details">
                  <h1 className="my-5">Order # {order._id}</h1>

                  <h4 className="mb-4">Shipping Info</h4>
                  <p>
                    <b>Name:</b> {user && user.name}
                  </p>
                  <p>
                    <b>Phone:</b>
                    {shippingInfo && shippingInfo.phoneNo}
                  </p>
                  <p className="mb-4">
                    <b>Address:</b>
                    {shippingDetails}
                  </p>
                  <p>
                    <b>Amount:</b> ₹ {totalPrice}
                  </p>

                  <hr />
                  <h4 className="my-4">Payment </h4>
                  <p className={isPaid ? "greenColor" : "redColor"}>
                    <b>{isPaid ? "PAID" : "NOT PAID"}</b>
                  </p>
                  {/* 
                  <h4 className="my-4">Payment ID</h4>
                  <p>
                    <b>{paymentInfo && paymentInfo.id}</b>
                  </p> */}

                  <h4 className="my-4">Order Status:</h4>
                  <p
                    className={
                      order.orderStatus &&
                      String(order.orderStatus).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderStatus}</b>
                  </p>

                  <h4 className="my-4">Order Items:</h4>

                  <hr />
                  <div className="cart-item my-1">
                    {orderItems &&
                      orderItems.map((item) => (
                        <div className="row my-5" key={item.product}>
                          <div className="col-4 col-lg-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              height="45"
                              width="65"
                            />
                          </div>

                          <div className="col-5 col-lg-5">
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>

                          <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                            <p>₹{item.price}</p>
                          </div>

                          <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                            <p>{item.quantity} Piece(s)</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <hr />
                </div>

                <div className="col-12 col-lg-3 mt-5">
                  <h4 className="my-4">Order Status</h4>

                  <div className="form-group">
                    <select
                      className="form-control"
                      name="orderstatus"
                      value={orderstatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => updateOrderHandler(order._id)}
                  >
                    Update Status
                  </button>
{paymentInfo && paymentInfo.status ==="succeeded" ? 
<div>
</div>: (<div> 
  <h4 className="my-4">Payment Status</h4>

<div className="form-group">
  <select
    className="form-control"
    name="paymentstatus"
    value={paymentstatus}
    onChange={(e) => setPaymentStatus(e.target.value)}
  >
    <option value="succeeded">Succeeded</option>
    <option value="not completed">Not completed</option>
  </select>
</div>

<button
  className="btn btn-primary btn-block"
  onClick={() => updatePaymentHandler(order._id)}
>
  Update Status
</button> 
 </div>)}
                 
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessOrder;
