import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import MetaData from "../layout/MetaData";
import { createCategory } from "../../actions/categoryActions";

const NewCategory = ({ history}) => {
  const [category, setcategory] = useState("");

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", category);

    dispatch(createCategory(formData));
    history.push("/admin/categories");
  };

  return (
    <div>
      <MetaData title={"Add Category"}/>
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h1 className="mb-4">Add Category</h1>
            <div className="form-group">
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={category}
                onChange={(e) => setcategory(e.target.value)}
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
  );
};

export default NewCategory;
