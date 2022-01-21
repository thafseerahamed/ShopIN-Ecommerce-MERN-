const express = require("express")
const app = express()
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors')
app.use(express.json())
app.use(cookieParser())
//Import all routes
const products = require('./routes/product')
const user = require('./routes/user')

app.use('/api/v1',products)
app.use('/api/v1',user)

// middleware to handle errors
app.use(errorMiddleware)

module.exports = app
