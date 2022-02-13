const express = require("express");
const { route } = require("express/lib/router");
const { newAddress, myAddress, getSingleAddress, deleteAddress, updateAddress } = require("../controllers/addressController");
const {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updatePasssword,
  updateProfile,
  allUsers,
  getUserDeatails,
  updateUser,
  deleteUser,
  blockUser,
  unBlockUser
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizeRoles,
  authorizeUser,
} = require("../middlewares/userAuth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logout);
router.route("/me").get(isAuthenticatedUser, getUserProfile);

router.route("/password/update").put(isAuthenticatedUser, updatePasssword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDeatails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/admin/blockuser/:id").put(isAuthenticatedUser,authorizeRoles("admin"),blockUser)  
router.route("/admin/unblockuser/:id").put(isAuthenticatedUser,authorizeRoles("admin"),unBlockUser)  
router.route("/address/new").post(isAuthenticatedUser,newAddress) 
router.route("/address/me").get(isAuthenticatedUser,myAddress)   
router.route("/address/:id").get(isAuthenticatedUser,getSingleAddress)   
                            .delete(isAuthenticatedUser,deleteAddress)
                            .put(isAuthenticatedUser,updateAddress)  
module.exports = router;
