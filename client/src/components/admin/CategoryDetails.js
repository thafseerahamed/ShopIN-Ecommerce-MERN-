import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allCategory, clearErrors } from '../../actions/categoryActions'


const CategoryDetails = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, categories = []} = useSelector(state => state.allCategories);


    useEffect(() => {
        dispatch(allCategory());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error])

    const setCategories = () => {
        const data = {
            columns: [
                {
                    label: 'Category Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Category Id',
                    field: 'id',
                    sort: 'asc'
                },
               
              
            ],
            rows: []
        }

    categories.forEach(category => {
            data.rows.push({
                name:category.name,
                id: category._id,
               
              
               
            })
        })

        return data;
    }

  return (
    <Fragment>

    <MetaData title={'Categories'} />

    <h1 className="my-5">Categories</h1>

    {loading ? <Loader /> : (
        <MDBDataTable
            data={setCategories()}
            className="px-3"
            bordered
            striped
            hover
           
        />
    )}

</Fragment>
  )
}

export default CategoryDetails