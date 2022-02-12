import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allOffers, clearErrors, deleteOffer } from '../../actions/offerActions'

const AllOffers = () => {


    
    const alert = useAlert();
    const dispatch = useDispatch();
    const {isDeleted} = useSelector(state => state.offer)
    const { loading, error, offers = []} = useSelector(state => state.allOffers);


    useEffect(() => {
        dispatch(allOffers());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error,isDeleted])
    const deleteOrderHandler = (id) => {
        if (window.confirm(`Delete this Offer ?`)) {dispatch(deleteOffer(id))}
      }
    

    const setOffers = () => {
        const data = {
            columns: [
                {
                    label: 'Offer Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Offer Id',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Category',
                    field: 'category',
                    sort: 'asc'
                },
                {
                    label: 'Discount',
                    field: 'discount',
                    sort: 'asc'
                },
                {
                    label: "Action",
                    field: "actions",
                  },
              
            ],
            rows: []
        }

    offers.forEach(offer => {
            data.rows.push({
                name:offer.title,
                id: offer._id,
                category: offer.category,
                discount:`${offer.discountPercentage}%`,
                actions:<div> <button className="btn btn-danger py-1 px-2 mt-1"  onClick={() => deleteOrderHandler(offer._id)}>
                <i className="fa fa-trash"></i>
              </button>
            </div>
              
               
            })
        })

        return data;
    }

  return (
    <Fragment>

    <MetaData title={'All Offers'} />

    <h1 className="my-5">Offers</h1>

    {loading ? <Loader /> : (
        <MDBDataTable
            data={setOffers()}
            className="px-3"
            bordered
            striped
            hover
           
        />
    )}

</Fragment>
  )
}

export default AllOffers