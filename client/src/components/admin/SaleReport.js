import React, { useEffect, forwardRef ,Fragment} from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import { Table, Button, Row, Col, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'
import MaterialTable from 'material-table'
import {
  AddBox,
  ArrowDownward,
  Check,
  ChevronLeft,
  ChevronRight,
  Clear,
  DeleteOutline,
  Edit,
  FilterList,
  FirstPage,
  LastPage,
  Remove,
  SaveAlt,
  Search,
  ViewColumn,
} from '@material-ui/icons'


const SaleReport = () => {

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => (
          <ChevronRight {...props} ref={ref} />
        )),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => (
          <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
      }
      
     
        const columns = [
          { title: 'Product ID', field: 'id' },
          { title: 'Name', field: 'name' },
          { title: 'Quantity sold', field: 'quantity', type: 'numeric' },
        
          {
            title: 'Amount paid',
            field: 'paid',
            type: 'currency',
            currencySetting: {
              locale: 'en',
              currencyCode: 'inr',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
          },
          {
            title: 'Pending amount',
            field: 'unpaid',
            type: 'currency',
            currencySetting: {
              locale: 'en',
              currencyCode: 'inr',
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            },
          },
        ]
        const dispatch = useDispatch()
      
      
        const [products, setProducts] = React.useState([])
        const [loading, setLoading] = React.useState(true)
        const [error, setError] = React.useState(false)
        const [lower, setLower] = React.useState('2000-01-01')
        const [upper, setUpper] = React.useState('2040-01-01')
        const { user } = useSelector((state) => state.user)
        const { userInfo } = user


        const submitHandler = (e) => {
            e.preventDefault()
            fetchData()
          }
        
          const fetchData = async () => {
            const { data } = await axios.get(
              `/api/v1/admin/order/report/${upper}?lower=${lower}`
            )
            setProducts(data.products)
          }
          useEffect(() => {
           
        
            fetchData()
          }, [dispatch])
  return(
    <div>

  
   
<Form className="my-3" onSubmit={submitHandler}>
        <Row>
          <Col md={2}>
            <label htmlFor="lower">From</label>
            <input
              type="date"
              className="form-control"
              id="lower"
              onChange={(e) => {
                e.preventDefault()
                setLower(e.target.value)
              }}
              name="birthday"
            ></input>
          </Col>
          <Col md={2}>
            <label htmlFor="upper">To</label>
            <input
              type="date"
              className="form-control"
              id="upper"
              onChange={(e) => {
                e.preventDefault()
                setUpper(e.target.value)
              }}
              name="birthday"
            ></input>
          </Col>
          <Col md={2}>
            <Button className="datebutton" type="submit">
              Find
            </Button>
          </Col>
        </Row>
      </Form>
      <MaterialTable
        icons={tableIcons}
        data={products}
        columns={columns}
        title={'Sales Report'}
        options={{
          filtering: true,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30, 40, 50],
          exportButton: true,
          exportAllData: true,
        }}
      />
    </div>
  )
}
export default SaleReport
