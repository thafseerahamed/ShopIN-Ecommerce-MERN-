import React, { useEffect, useState } from 'react'
import { Link} from "react-router-dom"
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader';
import Sidebar from './Sidebar'
import { getAdminProducts} from '../../actions/productActions'
import { allOrders} from '../../actions/orderActions'
import { useDispatch, useSelector} from "react-redux";
import { allUsers } from '../../actions/userActions';
import axios from 'axios'
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Legend,
  Tooltip,
  CartesianGrid,
  Line,
  LineChart,
  PieChart,
  Pie,
  Sector,
  Cell,
} from 'recharts'

import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Col, Container, Row } from 'react-bootstrap'




const Dashboard = () => {

    const dispatch = useDispatch();
    const {products = []} = useSelector(state => state.products)
    const {users} = useSelector(state => state.allUsers)
    const {orders,totalAmount,loading} = useSelector(state => state.allOrders)

    const [productss, setProductss] = useState([])
  const [info, setInfo] = useState()
  const [infoLastMonth, setInfoLastMonth] = useState()
  const [info2, setInfo2] = useState()
  const [info3, setInfo3] = useState()
  const [userss, setUserss] = useState()
  const [lower, setLower] = useState('2000-01-01')
  const [upper, setUpper] = useState('2040-01-01  ')
  const [electronicsNumber, setElectronicsNumber] = useState(0)
  const [laptopNumber, setLaptopNumber] = useState(0)
  const [othersNumber, setOthersNumber] = useState(0)
  const [productNumber, setProductNumber] = useState(0)



  var today = new Date()
  var dd = String(today.getDate()).padStart(2, '0')
  var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
  var yyyy = today.getFullYear()
  const currentMonth = `${yyyy}-${mm}-${dd}`
  const previousMonth1 = `${mm - 1 > 0 ? yyyy : yyyy - 1}-${
    mm - 1 > 0 ? mm - 1 : 12 + mm
  }-${dd}`
  const previousMonth2 = `${mm - 2 > 0 ? yyyy : yyyy - 1}-${
    mm - 2 > 0 ? mm - 2 : 12 + Number(mm) - 2
  }-${dd}`
  const previousMonth3 = `${mm - 3 > 0 ? yyyy : yyyy - 1}-${
    mm - 3 > 0 ? mm - 3 : 12 + Number(mm) - 3
  }-${dd}`
  const previousMonth4 = `${mm - 2 > 0 ? yyyy : yyyy - 1}-${
    mm - 4 > 0 ? mm - 4 : 12 + Number(mm) - 4
  }-${dd}`

  const fetchData = async () => {
    const { data } = await axios.get(
      `/api/v1/admin/order/report/${currentMonth}?lower=${previousMonth1}`
    )
    setProductss(data.products)
    setInfo(data)

    const responsePrevious1Month = await axios.get(
        `/api/v1/admin/order/report/${previousMonth1}?lower=${previousMonth2}`
      )
      setInfoLastMonth(responsePrevious1Month.data)
  
      const responsePrevious2Month = await axios.get(
        `/api/v1/admin/order/report/${previousMonth2}?lower=${previousMonth3}`
      )
      setInfo2(responsePrevious2Month.data)
  
      const responsePrevious3Month = await axios.get(
        `/api/v1/admin/order/report/${previousMonth3}?lower=${previousMonth4}`
      )
      setInfo3(responsePrevious3Month.data)
    }


    const qtyData = [
      
        {
          name: 'One month ago',
          qty: info2 && info2.qty,
        },
        {
          name: 'Last month',
          qty: infoLastMonth && infoLastMonth.qty,
        },
        {
          name: 'This month',
          qty: info && info.qty,
        },
      ]
   
      
      const userData = [
        {
          name: 'Two months ago',
          number: userss && userss.userNumbers[0],
        },
        {
          name: 'One month ago',
          number: userss && userss.userNumbers[1],
        },
        {
          name: 'Last month',
          number: userss && userss.userNumbers[2],
        },
        {
          name: 'This month',
          number: userss && userss.userNumbers[3],
        },
      ]


      const productData = [
        { name: 'Electronics', value: electronicsNumber && electronicsNumber },
        { name: 'Laptops', value: laptopNumber && laptopNumber },
        { name: 'Others', value: othersNumber && othersNumber },
      ]
      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

        const RADIAN = Math.PI / 180
      const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
        return (
          <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
          >
            {`${(percent * 100).toFixed(0)}%`}
          </text>
        )
      }
      console.log(info);
      const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Consolidated Revenue (Monthly)',
          },
        },
      }


      const optionsForQuantity = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Quantity Sold (Monthly)',
          },
        },
      }


    useEffect(() => {
        const getUserData = async () => {
            const { data } = await axios.get('/api/v1/admin/users/dashboard')
            setUserss(data)
          }
          const getProductData = async () => {
            const { data } = await axios.get('/api/v1/admin/products/dashboard')
            setElectronicsNumber(data.electronics)
            setLaptopNumber(data.laptop)
            setOthersNumber(data.others)
            setProductNumber(data.length)
          }

          getUserData()
          getProductData()
      
          fetchData()
        dispatch(getAdminProducts())
        dispatch(allOrders())
        dispatch(allUsers())
    },[dispatch])



    const sample = [
        {
          name: 'Two months ago',
          paid: info3 && info3.paid,
          unpaid: info3 && info3.unpaidAmount,
          total: info3 && info3.total,
        },
        {
          name: 'Two months ago',
          paid: info2 && info2.paid,
          unpaid: info2 && info2.unpaidAmount,
          total: info2 && info2.total,
        },
        {
          name: 'One month ago',
          paid: infoLastMonth && infoLastMonth.paid,
          unpaid: infoLastMonth && infoLastMonth.unpaidAmount,
          total: infoLastMonth && infoLastMonth.total,
        },
        {
          name: 'Last month',
          paid: info && info.paid,
          unpaid: info && info.unpaidAmount,
          total: info && info.total,
        },
      ]

    let outOfStock =0
    products.forEach(product => {
        if(product.stock === 0){
            outOfStock += 1
        }
    })
  return <div>
        <div className="row">

            <div className="col-12 col-md-2">
                <Sidebar/>
            </div>
            <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>

                    {loading ? <Loader/>: (
                        <div>
                        <MetaData title={"Admin Dashboard"}/>

                        <div className="row pr-4">
                                <div className="col-xl-12 col-sm-12 mb-3">
                                    <div className="card text-white bg-primary o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Total Amount<br /> <b>₹{totalAmount && totalAmount.toFixed(2)}</b>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row pr-4">
                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-success o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Products<br /> <b>{products && products.length}</b></div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-danger o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Orders<br /> <b>{orders && orders.length}</b></div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-info o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Users<br /> <b>{users && users.length}</b></div>
                                        </div>
                                        <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                            <span className="float-left">View Details</span>
                                            <span className="float-right">
                                                <i className="fa fa-angle-right"></i>
                                            </span>
                                        </Link>
                                    </div>
                                </div>


                                <div className="col-xl-3 col-sm-6 mb-3">
                                    <div className="card text-white bg-warning o-hidden h-100">
                                        <div className="card-body">
                                            <div className="text-center card-font-size">Out of Stock<br /> <b>{outOfStock}</b></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-center">Monthly Sales</h3>

<ResponsiveContainer width="100%" height={400}>
  <BarChart data={sample}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="total" fill="#8884d8" />
    <Bar dataKey="unpaid" fill="#82ca9d" />
    <Bar dataKey="paid" fill="#e63d00" />
  </BarChart>
</ResponsiveContainer>

{/* <h3 className="text-center">Quantity Sold</h3>

<ResponsiveContainer width="100%" height={400}>
  <LineChart width={300} height={100} data={qtyData}>
    <Line
      type="monotone"
      dataKey="qty"
      stroke="#8884d8"
      strokeWidth={2}
    />
    <XAxis dataKey="name" />
    <YAxis />
  </LineChart>
</ResponsiveContainer> */}

<h1 className="text-center">Users Overview</h1>

<Row>
  <Col lg={4} md={6} xs={12}>
    <div className="my-3 border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center">
      <h5>Number of Users</h5>
      <h5 className="letter-spacing-1">{users && users.usersCount}</h5>
      <p className="m-0"></p>
    </div>
  </Col>
</Row>
<ResponsiveContainer width="100%" height={400}>
  <BarChart width={300} height={100} data={userData}>
    <Bar dataKey="number" fill="#8884d8" />
    <XAxis dataKey="name" />
    <YAxis />
  </BarChart>
</ResponsiveContainer>




<h1 className="text-center">Products Overview</h1>

<Row>
  <Col lg={4} md={6} xs={12}>
    <div className="my-3 border-1 rounded-2 shadow p-3 bg-white d-flex flex-column align-items-center justify-content-center">
      <h5>Number of Products</h5>
      <h5 className="letter-spacing-1">
        {productNumber && productNumber}
      </h5>
      <p className="m-0"></p>
    </div>
  </Col>
</Row>
<ResponsiveContainer width="100%" height={400}>
  <PieChart width={300} height={100}>
    <Pie
      data={productData}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={renderCustomizedLabel}
      outerRadius={150}
      fill="#8884d8"
      dataKey="value"
    >
      {productData.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={COLORS[index % COLORS.length]}
        />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
                            </div>


                    )}
                            
                </div>
        </div>
  </div>;
};

export default Dashboard;

