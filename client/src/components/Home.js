import React, { Fragment, useEffect, useState } from 'react';
import MetaData from './layout/MetaData'
import Pagination from 'react-js-pagination'
import {useDispatch,useSelector} from 'react-redux'
import { getProducts } from '../actions/productActions';
import Product from './product/Product';
import Loader from './layout/Loader';
import {useAlert } from 'react-alert'


const Home = ({match}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const alert = useAlert() 
  const dispatch = useDispatch()
  const {loading,products,error,productsCount,resPerPage} = useSelector(state => state.products)
 const keyword = match.params.keyword
useEffect(() => {

  if(error){
    return alert.error(error)
}
 
 dispatch(getProducts(keyword,currentPage))



}, [dispatch,alert,error,keyword,currentPage]);

function setCurrentPageNo (pageNumber){
  setCurrentPage(pageNumber)
}


  return <Fragment>
    {loading ? <Loader/> :
    (
      <Fragment>
           <MetaData title="Buy Best Products"/>
 <h2 id="products_heading">Latest Products</h2>
       <section id="products" className="container mt-3">
      <div className="row">
        {products && products.map(product =>{
return(
  <Product key ={product._id} product={product} />
)

        })}
       
        </div>
        </section>

        {resPerPage <= productsCount &&(
            <div className="d-flex justify-content-center mt-5">
            <Pagination 
                      activePage={currentPage}
                      itemsCountPerPage={resPerPage}
                      totalItemsCount={productsCount}
                      onChange={setCurrentPageNo}
                      nextPageText={'Next'}
                      prevPageText={'Prev'}
                      firstPageText={'First'}
                      lastPageText={'Last'}
                      itemClass='page-item'
                      linkClass='page-link'
                      />
           </div>


        )}
      
</Fragment>

    )}
 


  </Fragment>;
};

export default Home;
