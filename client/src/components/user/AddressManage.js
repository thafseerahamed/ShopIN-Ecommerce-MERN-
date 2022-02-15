import React, { useEffect } from 'react'
import { myAddress,clearErrors, deleteAddress } from '../../actions/addressActions';
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import { DELETE_ADDRESS_RESET } from '../../constants/addressConstants';

const AddressManage = ({ history}) => {
    const dispatch = useDispatch();
    const alert = useAlert();
    const {shippingData = [],loading,error} = useSelector(state => state.shippingData)
  const {isDeleted,error: deleteError} = useSelector(state => state.updateAddress)
    useEffect(() => {
    
        dispatch(myAddress());
    
        if (error) {
          alert.error(error);
          dispatch(clearErrors());
        }
        if (deleteError) {
            alert.error(deleteError);
            dispatch(clearErrors());
          }
        if (isDeleted) {
            alert.success("Address deleted successfully");
          history.push('/address/me')
          dispatch ({ type:DELETE_ADDRESS_RESET})
          }
      }, [dispatch, alert, error,isDeleted]);

      const deleteAddressHandler = (id) => {
        if (window.confirm(`Delete this Address ?`)) {dispatch(deleteAddress(id))}
      }
    

      const setAddress = () => {
        const data = {
            columns: [
                {
                    label: 'Address',
                    field: 'address',
                    sort: 'asc'
                },
                {
                    label: 'Country',
                    field: 'country',
                    sort: 'asc'
                },
                {
                    label: 'phone No',
                    field: 'phoneno',
                    sort: 'asc'
                },
               
                {
                    label: 'Actions',
                    field: 'actions',
                    sort: 'asc'
                },
            ],
            rows: []
        }

    shippingData.forEach(shippingInfo => {
            data.rows.push({
                address: `${shippingInfo.address},${shippingInfo.city},${shippingInfo.postalCode}`,
               country: shippingInfo.country,
                phoneno: shippingInfo.phoneNo,
               
                actions:
                <div className="mx-auto">
                    <Link to={`/address/update/${shippingInfo._id}`} className="btn btn-primary mx-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                     <button className="btn btn-danger mx-2" onClick={() => deleteAddressHandler(shippingInfo._id)}>
                     <i className="fa fa-trash"></i>
                 </button>
                
                 </div>
            })
        })

        return data;
    }
  return (
    <div>



<MetaData title={'My Addresses'} />

<h1 className="my-5">My Addresses</h1>

{loading ? <Loader /> : (
    <div>
     <Link to={`/address/new`} className="btn btn-success mx-2" >
     <i className="fa fa-plus"></i>
 </Link>
    <MDBDataTable
        data={setAddress()}
        className="px-3"
        bordered
        striped
        hover
       
    />
    
    </div>
)}


    </div>
  )
}

export default AddressManage