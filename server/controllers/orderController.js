const Order = require("../models/order");
const Product = require("../models/product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

//Get single order   =>  /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//Get logged in user orders   =>  /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  // if (req.user.isBlocked) {
  //   return next(new ErrorHandler("Blocked ID", 404));
  // }
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});


//Update/ Process order - USER  =>  /api/v1/order/:id
exports.userUpdateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);


  if (order.paymentInfo.status === "succeeded") {
    return next(new ErrorHandler("You Cannot Cancel the Paid Order", 400));
  }
 

  order.orderStatus ="Cancelled"


  await order.save();
  res.status(200).json({
    success: true,
  });
});


//Get all orders - ADMIN  =>  /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

//Update/ Process order - ADMIN  =>  /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  if (order.orderStatus === "Cancelled") {
    return next(new ErrorHandler("You have already cancelled this order", 400));
  }
  if (req.body.orderstatus == "Delivered") {
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });
  }

  order.orderStatus = req.body.orderstatus;

  order.deliveredAt = Date.now();

  await order.save();
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;

  await product.save({ validateBeforeSave: false });
}

//Delete order   =>  /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});

// @desc    Get details for report
// @route   GET /api/v1/orders/report/:id
// @access  Private/ Admin
exports.report = catchAsyncErrors(async (req, res) => {
  const upper = req.params.id;
  const lower = req.query.lower;

  let products = [];
  let total = 0;
  let quantity = 0;
  let paid = 0;
  let unpaid = 0;
  let paidAmount = 0;
  let unpaidAmount = 0;

  const orders = await Order.find({
    createdAt: {
      $gte: lower,
      $lt: upper,
    },
  })
    .sort({ createdAt: -1 })
    .populate("orderItems", "product price quantity name");
  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (item.product) {
        let product = products.find((product) => product.name === item.name);
        if (product) {
          product.quantity += item.quantity;
          product.total += item.price;
          if (order.paymentInfo.status === "succeeded") {
            product.paid += item.price;
          } else {
            product.unpaid += item.price;
          }
        } else {
          products.push({
            id: item.product,
            name: item.name,
            quantity: item.quantity,
            total: item.price,
            paid: 0,
            unpaid: 0,
            paidQty: 0,
          });
          if (order.paymentInfo.status === "succeeded") {
            products[products.length - 1].paid += item.price;
            products[products.length - 1].paidQty += item.quantity;
          } else {
            products[products.length - 1].unpaid += item.price;
          }
        }
      }
    });
  });
  products.forEach((product) => {
    quantity += product.quantity;
    total += product.total;
    if (product.paid) {
      paid += product.paid;
    } else {
      unpaid += product.unpaid;
    }
    paidAmount += product.paid;
    unpaidAmount += product.unpaid;
  });
  res.json({
    products,
    quantity: quantity,
    total: total,
    unpaid: Math.round(unpaid * 100) / 100,
    paid: Math.round(paid * 100) / 100,
    paidAmount: Math.round(paidAmount * 100) / 100,
    unpaidAmount: Math.round(unpaidAmount * 100) / 100,
  });
});
