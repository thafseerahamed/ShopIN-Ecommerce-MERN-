import React, { Fragment, useState, useEffect } from 'react'
import {countries} from 'countries-list'



import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { UPDATE_ADDRESS_RESET } from "../../constants/addressConstants"
import { orderAddressDetails, updateAddress,clearErrors } from '../../actions/addressActions'
import Loader from '../layout/Loader'

const UpdateAddress = ({match,history}) => {
    const { orderAddress,error,loading:load } = useSelector(state => state.orderAddress)
    const countryList = Object.values(countries)
    const ad = orderAddress && orderAddress.address 
    const po = orderAddress && orderAddress.postalCode
    const ph = orderAddress && orderAddress.phoneNo
    const cou = orderAddress && orderAddress.country
    const ci = orderAddress && orderAddress.city
    const [address, setAddress] = useState(`${ad}`)
    const [postalCode, setPostalCode] = useState(`${po}`);
    const [phoneNo, setPhoneNo] = useState(`${ph}`);
    const [country, setCountry] = useState(`${cou}`);
    const [city, setCity] = useState(`${ci}`);
    const alert = useAlert();
    const dispatch = useDispatch();

    // const { isUpdated,updateError } = useSelector(state => state.UpdateAddress);

const { isUpdated, error : updateError,loading} = useSelector((state) => state.updateAddress)
    const addressId = match.params.id;
    const submitHandler = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.set("address", address);
        formData.set("city", city);
        formData.set("postalCode", postalCode);
        formData.set("phoneNo", phoneNo);
        formData.set("country", country);
      
        dispatch(updateAddress(addressId,formData));
        // if (error) {
        //     alert.error(error);
        //     dispatch(clearErrors());
        //     history.push('/address/update/')
        //   }else{
        //       history.push('/admin/offers')
        //   }
      };


    useEffect(() => {
    
    
          dispatch(orderAddressDetails(addressId));

        //   if (orderAddress && orderAddress._id !== addressId) {
        //     dispatch(orderAddressDetails(addressId));
        //   } else {
            //    setAddress(orderAddress && orderAddress.address);
            //   setCity(orderAddress && orderAddress.city);
            //    setPostalCode(orderAddress && orderAddress.postalCode);
            
            //  setPhoneNo(orderAddress && orderAddress.phoneNo);
            //  setCountry(orderAddress && orderAddress.country);
         
        //   }
     
        //   setAddress(orderAddress && orderAddress.address);
        //   setCity(orderAddress && orderAddress.city);
        //   setPostalCode(orderAddress && orderAddress.postalCode);
        
        //   setPhoneNo(orderAddress && orderAddress.phoneNo);
        //   setCountry(orderAddress && orderAddress.country);
     
       
        if (updateError) {
          alert.error(updateError);
          dispatch(clearErrors());
        }
    
        if (isUpdated) {
          history.push("/address/me");
          alert.success("address updated successfully");
          dispatch({ type: UPDATE_ADDRESS_RESET });
        }
      }, [
        dispatch,
        alert,
     error,
        isUpdated,
        history,
        updateError,
        
        addressId,
      ]);
    

  return (
    <div>

{load || loading ? <Loader/> :(

    <div>
<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} >
                        <h1 className="mb-4">Add Address</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label  htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={(e) => setPhoneNo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label  htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label  htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                required
                            >
                                {countryList.map( country => (
                                        <option key= {country.name} value={country.name}>
                                        {country.name}
                                    </option>

                                    ))}
                                
                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false}
                        >
                            UPDATE
                            </button>
                    </form>
                </div>
            </div>
</div>
)}

    </div>
  )
}

export default UpdateAddress