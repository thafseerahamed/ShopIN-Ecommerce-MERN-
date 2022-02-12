const express = require("express");
const { newCategory, allCategories } = require("../controllers/categoryControllers");
const { addOffer, getAllOffers, deleteOffer } = require("../controllers/offerControllers");
const router = express.Router();

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middlewares/userAuth");

router.route("/products").get(getProducts);
router.route("/admin/products").get(getAdminProducts);
router.route("/product/:id").get(getSingleProduct);
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newProduct);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/admin/category/new").post(isAuthenticatedUser,authorizeRoles("admin"),newCategory)
router.route("/admin/categories").get(isAuthenticatedUser,authorizeRoles("admin"),allCategories)

router.route("/admin/offer/new").post(isAuthenticatedUser, authorizeRoles("admin"),addOffer)
router.route("/admin/offers").get(isAuthenticatedUser, authorizeRoles("admin"),getAllOffers)
router.route("/admin/offer/delete/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteOffer)

router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
