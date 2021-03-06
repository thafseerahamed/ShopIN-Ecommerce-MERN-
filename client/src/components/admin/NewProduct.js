import React, { useEffect, useState } from "react";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import axios from 'axios'
import MetaData from "../layout/MetaData";
import CropImage from './CropImage'
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { newProduct, clearErrors } from "../../actions/productActions";
import Sidebar from "./Sidebar";
import { allCategory } from "../../actions/categoryActions";

const NewProduct = ({ history }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [image, setImage] = useState("");
  const [imagesPreview, setImagesPreview] = useState([]);
  const [showCropper, setShowCropper] = useState(false)
  const [cropImage, setCropImage] = useState(false)
  const [imageOne, setImageOne] = useState(null)
  const [uploading, setUploading] = useState(false)
  const {  categories = []} = useSelector(state => state.allCategories);
 console.log(showCropper);
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.newProduct);

  useEffect(() => {
    dispatch(allCategory());


    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      history.push("/admin/products");
      alert.success("product created successfully");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
  }, [dispatch, alert, error, success, history]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("price", price);
    formData.set("description", description);
    formData.set("category", category);
    formData.set("stock", stock);
    formData.set("image", image);
    images.forEach((image) => {
      formData.append("images", image);
    });

    dispatch(newProduct(formData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImagesPreview([]);
    setImages([]);
  
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
      
        }
      };
      reader.readAsDataURL(file);
    });
  };


  const uploadFileHandler = async (image) => {
    console.log(image);

  
    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });
  
  async function Main() {
    let file = new File([image], "name.jpg");
     var Img = await toBase64(file);
     const formData = new FormData();

     formData.append("image",Img );
     try {
      const configB = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/v1/admin/main', formData, configB)
     setImage(data.url)
      setUploading(false)
    } catch (error) {
      setUploading(false)
    }

  }
  
  Main();
  

   


  }
  return (
    <div>
      <MetaData title={"All Products"} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">
          <div>
            <div className="wrapper my-5">
              <form
                className="shadow-lg"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">New Product</h1>
               

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price_field">Price</label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description_field">Description</label>
                  <textarea
                    className="form-control"
                    id="description_field"
                    rows="8"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="category_field">Category</label>
                  <select
                    className="form-control"
                    id="category_field"
                    value={category.name}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories && categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="stock_field">Stock</label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Main Image</label>
                  <input
                    type="text"
                    id="name_field"
                    className="form-control"
                      value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={(e) => {
                        setCropImage(e.target.files[0])
                        setShowCropper(true)
                      }}
                      accept=".jpg,.jpeg,.png,"
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Main Image
                    </label>
                  </div>

                  </div>


               
            {showCropper && (
            <>
            
            <CropImage
              src={cropImage}
              imageCallback={(image) => {
          
                setImageOne(image)
                setShowCropper(false)
                uploadFileHandler(image)
              }}
              closeHander={() => {
                setShowCropper(false)
              }}
            />
            </>
           )} 
       



                <div className="form-group">
                  <label>Images</label>

                  <div className="custom-file">
                    <input
                      type="file"
                      name="product_images"
                      className="custom-file-input"
                      id="customFile"
                      onChange={onChange}
                      multiple
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      Choose Images
                    </label>
                  </div>




                  {imagesPreview.map((img) => (
                    <img
                      src={img}
                      key={img}
                      alt="Images Preview"
                      className="mt-3 mr-2"
                      width="55"
                      height="52"
                    />
                  ))}
                </div>

                <button
                  id="login_button"
                  type="submit"
                  className="btn btn-block py-3"
                  disabled={loading ? true : false}
                >
                  CREATE
                </button>
              </form>
         
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
