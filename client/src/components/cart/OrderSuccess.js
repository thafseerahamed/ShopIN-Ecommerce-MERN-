import React from 'react';
import { Link } from 'react-router-dom'
import MetaData from '../layout/MetaData';

const OrderSuccess = () => {

    const paymentInfo = JSON.parse(sessionStorage.getItem('paymentInfo'))
  return <div>
<MetaData title={"Order Success"}/>

<div className="row justify-content-center">
            <div className="col-6 mt-5 text-center">
                <img className="my-5 img-fluid d-block mx-auto" src="/images/order_success.png" alt="Order Success" width="200" height="200" />

                <h2>Your Order has been placed successfully.</h2>
                <h5>Payment id:{paymentInfo && paymentInfo.id}</h5>
                <h5>Status:{paymentInfo && paymentInfo.status}</h5>

                <Link to="/orders/me">Go to Orders</Link>
            </div>

        </div>
  </div>;
};

export default OrderSuccess;
