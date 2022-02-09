const Address = require("../models/address");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//create a new address => /api/v1/address/new
exports.newAddress = catchAsyncErrors(async (req, res, next) => {
  const { address, city, postalCode, phoneNo, country } = req.body;

  const shippingInfo = await Address.create({
    address,
    city,
    postalCode,
    phoneNo,
    country,
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    shippingInfo,
  });
});



//Get logged in user Addresses   =>  /api/v1/address/me
exports.myAddress = catchAsyncErrors(async (req, res, next) => {
    const shippingData = await Address.find({ user: req.user._id });
  
    res.status(200).json({
      success: true,
      shippingData
    });
  });


  
//Get single Address  =>  /api/v1/address/:id
exports.getSingleAddress = catchAsyncErrors(async (req, res, next) => {
    const shippingInfo = await Address.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!shippingInfo) {
      return next(new ErrorHandler("No Order found with this ID", 404));
    }
  
    res.status(200).json({
      success: true,
      shippingInfo
    });
  });