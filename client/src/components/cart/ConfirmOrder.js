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
import { deductFromWallet, showWalletBalance } from "../../actions/userActions";

const ConfirmOrder = ({ history, match }) => {
 
  const wallet = useSelector((state) => state.wallet)
  const { data } = wallet
  let dat =data
  const { user } = useSelector((state) => state.user);
  const { orderAddress, loading } = useSelector((state) => state.orderAddress);
  const { cartItems, shippingInfo } = useSelector(state => state.cart)
  const id = match.params.id;
  const userId = user._id
  const alert = useAlert();
  const [couponName, setCouponName] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [message, setMessage] = useState(null)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponAppliedMessage, setCouponAppliedMessage] = useState(null)
  const [couponAmount, setCouponAmount] = useState(0)

  // Item prices

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const itemDiscount = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.price*item.discountPrice)/100,
    0
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 120;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  let walletUsed = 0
  if (itemsPrice + shippingPrice + taxPrice - dat > 0) {
    walletUsed = dat
  } else {
    walletUsed = itemsPrice+ shippingPrice + taxPrice
  }
  const totalPrice = (itemsPrice + shippingPrice + taxPrice - itemDiscount- walletUsed - couponAmount).toFixed(2);
  const dispatch = useDispatch();
  const address = orderAddress && orderAddress.address;
  const city = orderAddress && orderAddress.city;
  const postalCode = orderAddress && orderAddress.postalCode;
  const phoneNo = orderAddress && orderAddress.phoneNo;
  const country = orderAddress && orderAddress.country;

  const paymentMethods = ["razorpay", "stripe", "cashOnDelivery"];
  const [paymentMethod, setPaymentMethod] = useState("stripe");

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
 

  async function showRazorpay(order) {
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

    const options = {
      key: 'rzp_test_tVTxBmKirg3ns6',
      currency: resp.data.currency,
      amount: resp.data.amount.toString(),
      name: 'ShopIN',
      description: 'Make the payment to complete the process',
      image: '',
      handler: function (response) {
       
        dispatch(createOrder(order))
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
    dispatch(deductFromWallet(walletUsed))
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
        paymentInfo:{status:"not completed"},
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
    
    if (paymentMethod==="stripe"){
        history.push("/payment");
    }else if (paymentMethod==="razorpay"){
      showRazorpay(order)
    
    }else if (paymentMethod==="cashOnDelivery"){
        cashOnD()
    }
   
  };

  const applyCouponHandler = async (couponId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const couponDataRaw = await axios.put(
      '/api/v1/admin/coupon',
      { couponId, user: userId },
      config
    )
    console.log(couponDataRaw);
    if (couponDataRaw.data.error) {
      setMessage(couponDataRaw.data.error)
      alert.error(couponDataRaw.data.error)
    } else {
      setCouponApplied(true)
      setCouponAppliedMessage(`${couponDataRaw.data.discount} discount applied`)
      setCouponAmount(couponDataRaw.data.discount)
      alert.success(`${couponDataRaw.data.discount} discount applied`)
    }
  }

  useEffect(() => {
    //to get the list of all available coupons
    setMessage(null)
    const getAllCoupons = async () => {
      const { data } = await axios.get(`/api/v1/admin/coupon`)
      let da =data
      setCoupons(da)
      console.log(coupons);
    }
    getAllCoupons()
  }, [])

  useEffect(() => {
    dispatch(orderAddressDetails(id));
    dispatch(showWalletBalance())
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
               {item.discountPrice === 0 ?<p>
                          {item.quantity}x {item.price} ={" "}
                          <b>{item.quantity * item.price}</b>
                        </p>:
                        <p>
                        {item.quantity}x {item.netPrice} ={" "}
                        <b>{item.quantity * item.netPrice}</b>
                      </p>}         
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              ))}
           
          {/* )} */}

<h4 className="mt-4">Available Coupons:</h4>

           {  coupons.length > 0 &&
              coupons.map((coupon) => (
                <div key={coupon._id}>
                  <hr />
                  <div className="cart-item my-1">
                    <div className="row">
                      <div className="col-4 col-lg-2">
                      <p>
                        <b>{coupon.name}</b>
                      </p>
                      </div>

                      <div className="col-5 col-lg-6">
                       <p>{coupon.discount}OFF</p>
                      </div>
                      <div className="col-4 col-lg-2">
                      <p>
                        <a   onClick={() => {
                            
                                applyCouponHandler(coupon._id)
                              }}><b style={{cursor:"pointer"}}>APPLY</b></a>
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
              Discount:{" "}
              <span className="order-summary-values">₹ {itemDiscount}</span>
            </p>
            <p>
              Wallet used:{" "}
              <span className="order-summary-values">₹ {walletUsed}</span>
            </p>
{couponAmount > 0 && (
  <p>
              Coupon Applied:{" "}
              <span className="order-summary-values">₹ {couponAmount}</span>
            </p>


)}
            

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
