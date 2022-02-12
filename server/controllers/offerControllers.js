const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Offer = require("../models/offer");
const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");

// @desc    Add an offer
// @route   POST /api/offer
// @access  Private/ Admin
exports.addOffer = catchAsyncErrors(async (req, res,next) => {
  const { title, discountPercentage, active, category } = req.body
  let dup =false
const offers= await Offer.find({})
offers.forEach(async(offer) =>{
if (offer.category === category){
  dup=true
} 
}
 )
 console.log(dup)

 if(dup){
  return next(new ErrorHandler("Offer exists with this Category", 404));
 }

  const offer = new Offer({
    title,
    discountPercentage,
    active,
    category,
  })
  await offer.save()

  if (offer.active) {
    if (offer.category === 'Electronics') {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = offer.discountPercentage
        product.netPrice = product.price - (product.discountPrice*product.price)/100
       
        await product.save({ validateBeforeSave: false})
      })
    } else {
  
      const products = await Product.find({ category: offer.category })
    
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = offer.discountPercentage
          product.netPrice = product.price - (product.discountPrice*product.price)/100
          await product.save({ validateBeforeSave: false})
        })
      }
    }
  }
 
  res.status(201).json({
    success: true,
    offer
  })
})

// @desc    Update an offer
// @route   PUT /api/offer/:offerId
// @access  Private/ Admin
exports.updateOffer = catchAsyncErrors(async (req, res) => {
  const offerId = req.params.offerId

  const offer = await Offer.findById(offerId)

  const title = req.body.title || offer.title
  const active =
    req.body.active !== 'undefined' ? req.body.active : offer.active
  const discountPercentage =
    req.body.discountPercentage || offer.discountPercentage
  const category = req.body.category || offer.category

  offer.title = title
  offer.discountPercentage = discountPercentage
  offer.active = active
  offer.category = category

  await offer.save()

  if (offer.active) {
    if (offer.category.length === 0) {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = offer.discountPercentage
        await product.save()
      })
    } else {
      const products = await Product.find({ category: offer.category })
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = offer.discountPercentage
          await product.save()
        })
      } else {
      }
    }
  } else {
    if (offer.category === 'all') {
      const products = await Product.find({})
      products.forEach(async (product) => {
        product.discountPrice = 0
        await product.save()
      })
    } else {
      const products = await Product.find({ category: offer.category })
      if (products) {
        products.forEach(async (product) => {
          product.discountPrice = 0
          await product.save()
        })
      } else {
      }
    }
  }

  res.json(offer)
})

// @desc    Get all offers
// @route   GET /api/offer
// @access  Private/ Admin
exports.getAllOffers = catchAsyncErrors(async (req, res) => {
  const offers = await Offer.find({})

  res.json({
    success: true,
    offers
  })
})

// @desc    Get one offer
// @route   GET /api/offer/:offerId
// @access  Private/ Admin
const getOfferById = catchAsyncErrors(async (req, res) => {
  const offerId = req.params.id
  const offer = await Offer.findById(offerId)
  res.json(offer)
})

// @desc    Delete an offer
// @route   DELETE /api/offer/:offerId
// @access  Private/ Admin
exports.deleteOffer= catchAsyncErrors(async (req, res) => {

  const offerId = req.params.id
  const offer = await Offer.findById(offerId)

  const products = await Product.find({ category: offer.category })

  products.forEach(async (product) => {
    product.discountPrice=0
    await product.save({ validateBeforeSave: false})
  })
  await Offer.deleteOne({ _id: offerId })

  res.json({
    success: true,
   })
})

