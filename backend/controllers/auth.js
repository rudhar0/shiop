// backend/controllers/auth.js - Updated with User Data Return
const jwt = require("jsonwebtoken");
const mailService = require("../services/mailer");
const otpGenerator = require("otp-generator");
const { promisify } = require("util");
const otp = require("../Template/mail/otp");
const crypto = require('crypto');
const resetPassword = require("../Template/mail/resetpassword");
const User = require("../models/user");
const filterObj = require("../utils/filterObj");

const signToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECREATE);

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !password || !email) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }

  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "password",
    "email"
  );

  const existing_user = await User.findOne({ email });

  if (existing_user && existing_user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already in use, please login.",
    });
  } else if (existing_user) {
    const updated_user = await User.findOneAndUpdate({ email }, filteredBody, {
      new: true,
      validateModifiedOnly: true,
    });

    req.userId = existing_user._id;
    next();
  } else {
    const new_user = await User.create(filteredBody);
    req.userId = new_user._id;
    next();
  }
};

exports.sendOtp = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();
  await user.save({ new: true, validateModifiedOnly: true });

  console.log('OTP:', new_otp);

  try {
    // Send email
    await mailService.sendEmail({
      recipient: user.email,
      subject: "Verification OTP - Samaira Collection",
      html: otp(user.firstName, new_otp),
      attachments: [],
    });

    res.status(200).json({
      status: "success",
      message: "OTP Sent Successfully!",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  if (!(await user.correctOTP(otp, user.otp))) {
    return res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  // OTP is correct
  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    token,
    user_id: user._id,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      verified: user.verified
    }
  });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Both email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Email or password is incorrect",
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Please verify your email first",
      });
    }

    const token = signToken(user._id);

    console.log(user);
    res.status(200).json({
      status: "success",
      message: "Logged in successfully",
      token,
      user_id: user._id,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        verified: user.verified,
        isAdmin: user.isAdmin,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Error handling login: ", err);
    next(err);
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in! Please log in to get access.",
    });
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECREATE);

  const this_user = await User.findById(decoded.userId);
  if (!this_user) {
    return res.status(401).json({
      status: "error",
      message: "The user belonging to this token does no longer exists.",
    });
  }

  if (this_user.changedPasswordAfter(decoded.iat)) {
    return res.status(401).json({
      status: "error",
      message: "User recently changed password! Please log in again.",
    });
  }

  req.user = this_user;
  next();
};

exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with this email address.",
    });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    console.log('Reset URL:', resetURL);

    await mailService.sendEmail({
      recipient: user.email,
      subject: "Reset Password - Samaira Collection",
      html: resetPassword(user.firstName, resetURL),
      attachments: [],
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password Reset Successfully",
    token,
  });
};