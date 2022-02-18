const User = require("../models/user");
const ReferralId = require("../models/referral");
const Wallet = require("../models/wallet");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

// Register a user   => /api/v1/register

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  console.log(req.body.avatar);
  const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });

  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });
  sendToken(user, 200, res);
});

// Login user  => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  //Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  //Finding user in database
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email", 401));
  }
  if(user.isBlocked===true){
    {
      return next(new ErrorHandler("User Blocked", 401));
    }
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect password", 401));
  }

  sendToken(user, 200, res);
});

//Forgot password  =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  //create reset password url later
  // const resetUrl = `${req.protocol}://${req.get(
  //   "host"
  // )}/api/v1/password/reset/${resetToken}`;

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

  const message = `Your password reset token is as follow;\n\n${resetUrl}\n\n If you are not requested this email
    ,then ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "ShopIN Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset password  =>  /api/v1/password/reset/:token

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash URL tokens
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "password reset token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }
  //Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get currently  logged in user details   =>   /api/v1/me

exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update /change password  =>/api/v1/password/update

exports.updatePasssword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //Check previous user password
  const isMatched = await user.comparePassword(req.body.oldPassword);
  if (!isMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  await user.save();

  sendToken(user, 200, res);
});

// Update user profile   => /api/v1/update
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const image_id = user.avatar.public_id;
    const res = await cloudinary.v2.uploader.destroy(image_id);

    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Logout user   =>  /api/v1/Logout

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Admin Routes

//Get all users   =>  /api/v1/admin/users

exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Get user datails   =>  /api/v1/admin/user/:id
exports.getUserDeatails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does nor found with id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user profile   => /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Delete user datails   =>  /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does nor found with id: ${req.params.id}`)
    );
  }

  //remove avatar todo

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});



// Block user profile   => /api/v1/admin/blockuser/:id
exports.blockUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    
    isBlocked:true
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Unblock user profile   => /api/v1/admin/unblockuser/:id
exports.unBlockUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    
    isBlocked:false
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});



// @desc    Check if the given referral Id is valid
// @route   PUT /api/v1/referral
// @access  Private
exports.checkReferralId = catchAsyncErrors(async (req, res) => {

  const referralId = req.body.referralId
  const loguser = await User.findOne({ email: req.body.email})
const _id = loguser._id
  let parentUser
  let checked = false

  const referral = await ReferralId.find({})
  referral.forEach(async (item) => {
    if (item.referralId === referralId) {
      checked = true
      parentUser = item.user
      const wallet = new Wallet({
        user: _id,
        balance: 100,
      })
      await wallet.save()
      const test = await Wallet.findOneAndUpdate(
        {
          user: parentUser,
        },
        {
          $inc: { balance: 100 },
        },
        {
          new: true,
          upsert: true,
        }
      )
      res.json('success')
    }
  })

  if (!checked) {
    res.json('fail')
  }
})



// @desc    Add referral id
// @route   POST /api/referral
// @access  Private
exports.addReferralId = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id
  const referralA = req.user.name.slice(0, 2)
  const referralB = req.user.email.slice(0, 2)
  const referral = referralA + referralB

  const referralId = new ReferralId({
    user: userId,
    referralId: referral,
  })

  await referralId.save()

  res.json('success')
})


// @desc    Get referral id
// @route   GET /api/users/referral
// @access  Private
exports.getReferralId = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id

  const data = await ReferralId.find({
    user: userId,
  })
  res.json(data)
})


// // @desc    Get referral id
// // @route   GET /api/users/referral
// // @access  Private
// exports.getReferralId = catchAsyncErrors(async (req, res) => {
//   const userId = req.user._id

//   const data = await ReferralId.find({
//     user: userId,
//   })
//   res.json(data)
// })


// @desc    Delete wallet balance
// @route   PUT /api/v1/wallet
// @access  Private
exports.deductWalletBalance = catchAsyncErrors(async (req, res) => {
  const userId = req.user._id
  const amount = req.params.amount

  const test = await Wallet.findOneAndUpdate(
    {
      user: userId,
    },
    {
      $inc: { balance: -amount },
    },
    {
      new: true,
    }
  )

  res.json('success')
})


 // @desc    Get wallet balance
  // @route   GET /api/v1/wallet
  // @access  Private
  exports.showWalletBalance = catchAsyncErrors(async (req, res) => {
    const userId = req.user._id

    const data = await Wallet.find({
      user: userId,
    })
    if (data.length > 0) {
      const response = data[0].balance
      res.json(response)
    } else {
      res.json(0)
    }
  })



  exports.dashboard = catchAsyncErrors(async (req, res) => {
    const users = await User.find()
    const usersCount = users.length
  
    const users1 = await User.find({
      createdAt: {
        $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 4,
        $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 3,
      },
    })
  
    const users2 = await User.find({
      createdAt: {
        $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 3,
        $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 2,
      },
    })
    const users3 = await User.find({
      createdAt: {
        $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 2,
        $lt: Date.now() - 1000 * 60 * 60 * 24 * 30 * 1,
      },
    })
    const users4 = await User.find({
      createdAt: {
        $gte: Date.now() - 1000 * 60 * 60 * 24 * 30 * 1,
      },
    })
  
    const userNumbers = [
      users1.length,
      users2.length,
      users3.length,
      users4.length,
    ]
  
    res.json({
      usersCount,
      userNumbers,
    })
  })