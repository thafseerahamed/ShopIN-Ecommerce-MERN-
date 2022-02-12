import React, { useState,useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { createOffer } from "../../actions/offerActions";
import { allCategory,clearErrors } from "../../actions/categoryActions";

const CreateOffer = ({ history}) => {
 
    const alert = useAlert();
    const [title, setTitle] = useState("");
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [category, setCategory] = useState("Electronics");
    const {  loading,categories = []} = useSelector(state => state.allCategories);
const {error} = useSelector(state => state.newOffer)
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.set("title", title);
        formData.set("discountPercentage", discountPercentage);
        formData.set("category", category);
      
        dispatch(createOffer(formData));
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
            history.push('/admin/offer')
          }else{
              history.push('/admin/offers')
          }
      };


      useEffect(() => {

        dispatch(allCategory());


        if (error) {
       
        
        }
    

      },[dispatch, alert, error,  history])
  return (
    <div>

<div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Add Offer</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Title</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label  htmlFor="city_field">Discount Percentage</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                required
                            />
                        </div>

              

                        <div className="form-group">
                            <label  htmlFor="country_field">Category</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={category.name}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                {categories && categories.map( category => (
                                        <option key= {category.name} value={category.name}>
                                        {category.name}
                                    </option>

                                    ))}
                                
                            </select>
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
  )
}

export default CreateOffer