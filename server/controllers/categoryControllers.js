const Category = require("../models/category");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

//Create new category  =>  /api/v1/admin/category/new
exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({
    success: true,
    category,
  });
});


//Get all categories =>  /api/v1/admin/categories
exports.allCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
   categories
  });
});