import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MDBDataTable } from "mdbreact";

import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { allOrders,deleteOrder, clearErrors} from "../../actions/orderActions";
import Sidebar from "./Sidebar";
 import { DELETE_ORDER_RESET } from "../../constants/orderConstants";

const OrdersList = ({ history}) => {

    const alert = useAlert();
    const dispatch = useDispatch();
  
    const {
      loading,
      error,
     orders=[],
    } = useSelector((state) => state.allOrders);
    const {isDeleted} = useSelector(state => state.order)
console.log(orders);
  
  
    useEffect(() => {
      dispatch(allOrders());
  
      if (error) {
        alert.error(error);
        dispatch(clearErrors());
      }
     
        if (isDeleted) {
          alert.success("Order deleted successfully");
        history.push('/admin/orders')
        dispatch ({ type:DELETE_ORDER_RESET})
        }
  
    }, [dispatch, alert, error,isDeleted,history]);
  
    const deleteOrderHandler = (id) => {
      if (window.confirm(`Delete this Order ?`)) {dispatch(deleteOrder(id))}
    }
  
    const setOrders = () => {
      const data = {
        columns: [
          {
            label: " Order ID",
            field: "id",
            sort: "asc",
          },
          {
            label: "No of Items",
            field: "numOfItems",
            sort: "asc",
          },
          {
            label: "Amount",
            field: "amount",
            sort: "asc",
          },
          {
            label: "Status",
            field: "status",
            sort: "asc",
          },
          {
            label: "Actions",
            field: "actions",
          },
        ],
        rows: [],
      };
  
      orders.forEach((order) => {
        data.rows.push({
          id: order._id,
          numOfItems: order.orderItems.length,
          amount: `₹${order.totalPrice}`,
          status: order.orderStatus && String(order.orderStatus).includes('Delivered')
          ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
          : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
          actions: (
            <div>
              <Link
                to={`/admin/order/${order._id}`}
                className="btn btn-primary py-1 px-2 "
              >
                <i className="fa fa-eye"></i>
              </Link>
              <button className="btn btn-danger py-1 px-2 mt-1" onClick={() => deleteOrderHandler(order._id)}>
                <i className="fa fa-trash"></i>
              </button>
            </div>
          ),
        });
      });
  
      return data;
    };
  return <div>

<MetaData title={"All Orders"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <div>
            <h1 className="my-5"> All Orders</h1>
            {loading ? (
              <Loader />
            ) : (
              <div>
                <MDBDataTable
                  data={setOrders()}
                  className="px-3"
                  bordered
                  striped
                  hover
                />
              </div>
            )}
          </div>
        </div>
      </div>
  </div>;
};

export default OrdersList;
