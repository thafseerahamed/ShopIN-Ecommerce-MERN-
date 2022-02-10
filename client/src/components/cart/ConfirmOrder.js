import React, { useEffect, useState } from "react";
import axios from "axios"
import {useAlert } from 'react-alert'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import CheckoutSteps from "./CheckoutSteps";
import { saveShippingInfo } from "../../actions/cartActions";
import { orderAddressDetails } from "../../actions/addressActions";
import { clearErrors, createOrder } from "../../actions/orderActions";

const ConfirmOrder = ({ history, match }) => {
 
  const { user } = useSelector((state) => state.user);
  const { orderAddress, loading } = useSelector((state) => state.orderAddress);
  const { cartItems, shippingInfo } = useSelector(state => state.cart)
  const id = match.params.id;
  const alert = useAlert();
  // Item prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 120;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));

  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
  const dispatch = useDispatch();
  const address = orderAddress && orderAddress.address;
  const city = orderAddress && orderAddress.city;
  const postalCode = orderAddress && orderAddress.postalCode;
  const phoneNo = orderAddress && orderAddress.phoneNo;
  const country = orderAddress && orderAddress.country;

  const paymentMethods = ["razorpay", "stripes", "cashOnDelivery"];
  const [paymentMethod, setPaymentMethod] = useState("stripes");

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = src
      script.onload = () => {
        resolve(true)
      }
      script.onerror = () => {
        resolve(false)
      }
      document.body.appendChild(script)
    })
  }
 

  async function showRazorpay() {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const data = {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice,
        taxPrice,
        totalPrice,
        currency:"INR"
      }
      try {
     
        const config ={
            headers: {
                'Content-Type' : 'application/json'
            }
        }
    
       var resp =await axios.post('/api/v1/razorpay',data,config)
       
    }
        catch (error) {
     
        
            alert.error(error.response)
          
         }
console.log(resp);
    const options = {
      key: 'rzp_test_tVTxBmKirg3ns6',
      currency: resp.data.currency,
      amount: resp.data.amount.toString(),
      name: 'ShopIN',
      description: 'Make the payment to complete the process',
      image: '',
      handler: function (response) {
       
    
        history.push('/success')
        alert.success('Transaction successful')
      },
      prefill: {
        name: 'Thafseer',
        email: 'thafseerahamed@gmail.com',
        phone_number: '9037313031',
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
   
  }
  const proceedToPayment = () => {
    dispatch(saveShippingInfo({ address, city, postalCode, phoneNo, country }));
    const data = {
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice,
      taxPrice,
      totalPrice,
    };
 
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    const orderc = {
        orderItems:cartItems,
        
        shippingInfo
    }
   const cashOnD =() =>{
    dispatch(createOrder(orderc))
    history.push('/success')
   }
    const order = {
        orderItems:cartItems,
        paymentInfo:{status:"succeeded"},
        shippingInfo
    }
   
    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
    if (orderInfo){
        order.itemsPrice = orderInfo.itemsPrice
        order.shippingPrice = orderInfo.shippingPrice
        order.taxPrice = orderInfo.taxPrice
        order.totalPrice = orderInfo.totalPrice
        orderc.itemsPrice = orderInfo.itemsPrice
        orderc.shippingPrice = orderInfo.shippingPrice
        orderc.taxPrice = orderInfo.taxPrice
        orderc.totalPrice = orderInfo.totalPrice
    }
    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100)
    }
    
    if (paymentMethod==="stripes"){
        history.push("/payment");
    }else if (paymentMethod==="razorpay"){
      showRazorpay()
      dispatch(createOrder(order))
    }else if (paymentMethod==="cashOnDelivery"){
        cashOnD()
    }
   
  };

  useEffect(() => {
    dispatch(orderAddressDetails(id));
  }, [id]);

  return (
    <div>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />

      <div className="row d-flex justify-content-between">
        <div className="col-12 col-lg-8 mt-5 order-confirm">
          {loading ? (
            <Loader />
          ) : (
            <div>
              {" "}
              <h4 className="mb-3">Shipping Info</h4>
              <p>
                <b>Name:</b> {user && user.name}
              </p>
              <p>
                <b>Phone:</b> {orderAddress && orderAddress.phoneNo}
              </p>
              <p className="mb-4">
                <b>Address:</b>{" "}
                {`${orderAddress && orderAddress.address},${
                  orderAddress && orderAddress.city
                },${orderAddress && orderAddress.postalCode},${
                  orderAddress && orderAddress.country
                }`}
              </p>
              <hr />
              <h4 className="mt-4">Your Cart Items:</h4>
              {cartItems.map((item) => (
                <div key={item.product}>
                  <hr />
                  <div className="cart-item my-1">
                    <div className="row">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt="Laptop"
                          height="45"
                          width="65"
                        />
                      </div>

                      <div className="col-5 col-lg-6">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </div>

                      <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                        <p>
                          {item.quantity}x {item.price} ={" "}
                          <b>{item.quantity * item.price}</b>
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />
            <p>
              Subtotal:{" "}
              <span className="order-summary-values">₹ {itemsPrice}</span>
            </p>
            <p>
              Shipping:{" "}
              <span className="order-summary-values">₹ {shippingPrice}</span>
            </p>
            <p>
              Tax: <span className="order-summary-values">₹ {taxPrice}</span>
            </p>

            <hr />

            <p>
              Total:{" "}
              <span className="order-summary-values">₹ {totalPrice}</span>
            </p>

            <hr />
            {paymentMethods.map((method, index) => (
              <div key = {index}>
                <p>
                  <input type="radio" value={method} onChange={(e) => setPaymentMethod(e.target.value)}   name="payment" />
                  <b className="ml-3">{method}</b>
                </p>
              </div>
            ))}

            <button
              id="checkout_btn"
              className="btn btn-primary btn-block"
              onClick={proceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;
