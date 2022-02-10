const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const Razorpay =require('razorpay')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const shortid = require('shortid')

//Process stripe payment   =>  /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency:'inr',

        metadata: {integration_check : 'accept_a_payment '}
    })

    res.status(200).json({
        success: true,
        client_secret : paymentIntent.client_secret
    })
}) 



//Send stripe API Key   =>  /api/v1/stripeapi
exports.sendStripeApi = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({
     stripeApiKey : process.env.STRIPE_API_KEY
    })
}) 

// Razorpay---

 var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// const getOrder = async (id) => {
//   const data = Order.findById(id).populate('user', 'name email')
//   return data
// }

// app.post('/razorpay/:id', async (req, res) => {
//   const order = await getOrder(req.params.id)
//   order.isPaid = true
//   order.paidAt = Date.now()
//   await order.save()
//   const payment_capture = 1
//   const amount = 500
//   const currency = 'INR'

//   const options = {
//     amount: order.totalPrice * 100,
//     currency,
//     receipt: shortid.generate(),
//     payment_capture,
//   }

//   try {
//     const response = await razorpay.orders.create(options)
//     res.status(200).json({
//       id: response.id,
//       currency: response.currency,
//       amount: response.amount,
//     })
//   } catch (err) {
//     console.log(err)
//   }
// })
exports.razorpayPayment = catchAsyncErrors(async (req, res, next) => {
console.log(req.body);
    const payment_capture = 1
    const options = {
            amount: req.body.totalPrice* 100,
            currency:req.body.currency,
            receipt: shortid.generate(),
            payment_capture:payment_capture
          }

    try {
            const response = await razorpay.orders.create(options)
            res.status(200).json({
              id: response.id,
              currency: response.currency,
              amount: response.amount,
            })
          } catch (err) {
            console.log(err)
          }
    })

