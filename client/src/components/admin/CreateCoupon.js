import React, { useState} from "react";

import axios from 'axios'
const CreateCoupon = ({ history}) => {

    const [name, setName] = useState('')
    const [discount, setDiscount] = useState(0)


    const submitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData();
                formData.set("name", name);
                formData.set("discount", discount);
          
                const config = {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  };
                  const { data } = await axios.post("/api/v1/admin/coupon", formData, config);  
        history.push("/admin/coupons")
        }

  return (
    <div> <div>

    <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                        <form className="shadow-lg" onSubmit={submitHandler}>
                            <h1 className="mb-4">Add Coupon</h1>
                            <div className="form-group">
                                <label htmlFor="address_field">Name</label>
                                <input
                                    type="text"
                                    id="address_field"
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
    
                            <div className="form-group">
                                <label  htmlFor="city_field">Discount amount in rupees</label>
                                <input
                                    type="text"
                                    id="city_field"
                                    className="form-control"
                                    value={discount}
                                    onChange={(e) => setDiscount(e.target.value)}
                                    required
                                />
                            </div>
    
                  
    
                           
    
                            <button
                                id="shipping_btn"
                                type="submit"
                                className="btn btn-block py-3"
                            >
                                ADD
                                </button>
                        </form>
                    </div>
                </div>
    
    
    
    
    
    
    
        </div>
      )</div>
  )
}

export default CreateCoupon