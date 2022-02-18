import React, { useEffect ,useState} from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import axios from 'axios'


import { useAlert } from 'react-alert'


import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'

const AllCoupons = () => {

    const [coupons, setCoupons] = useState([])
    const [couponDeleted, setCouponDeleted] = useState(false)
    const loading =false
    const alert = useAlert();
 


    useEffect(() => {
        const getAllCoupons = async () => {
            const { data } = await axios.get(`/api/v1/admin/coupon`)
            setCoupons(data)
          }
          getAllCoupons()
        }, [couponDeleted])
      


    const setCoupon = () => {
        const data = {
            columns: [
                {
                    label: 'Coupon Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Coupon Id',
                    field: 'id',
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

    coupons.forEach(coupon => {
            data.rows.push({
                name:coupon.name,
                id: coupon._id,
          
                discount:coupon.discount,
            //     // actions:<div> <button className="btn btn-danger py-1 px-2 mt-1"  onClick={() => deleteOrderHandler(offer._id)}>
            //     <i className="fa fa-trash"></i>
            //   </button>
            // </div>
              
               
            })
        })

        return data;
    }

  return (
    <div>

    <MetaData title={'All Coupons'} />

    <h1 className="my-5">Coupons</h1>

    {loading ? <Loader /> : (
        <MDBDataTable
            data={setCoupon()}
            className="px-3"
            bordered
            striped
            hover
           
        />
    )}

</div>
  )
}

export default AllCoupons   

