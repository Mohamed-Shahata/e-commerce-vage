import User from "../models/user.model.js";
import sendEmail from "../services/emailServices.js";
import CustomError from "../utils/customerror.js";
import bcryptjs from "bcryptjs";
import { genrateAccessToken, genrateRefreshToken, verifyRefreshToken } from "../utils/tokens.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user)
    return next(new CustomError("User already exsits", 400));

  const RoundNum = Math.floor(100000 + Math.random() * 900000);

  await User.create({
    email, password, verification: RoundNum
  });

  sendEmail(email, RoundNum);

  res.status(200).json({ message: "check your email" });
}

export const verifyEmail = async (req, res, next) => {
  const { email, code } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email });
  if (!user)
    return next(new CustomError("User not found", 404));

  if (user.verification.toString() !== String(code).trim())
    return next(new CustomError("Code is wrong", 400));

  const accessToken = genrateAccessToken({ id: user._id, role: user.role });
  const refreshToken = genrateRefreshToken({ id: user._id, role: user.role });

  user.refreshToken = refreshToken;

  user.verification = "";
  user.isVerified = true;

  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(201).json({ message: "register successfully", data: user, accessToken, refreshToken });
}

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new CustomError("Email or password is valid", 400));

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid)
    return next(new CustomError("Email or password is invalid", 400));


  const accessToken = genrateAccessToken({ id: user._id, role: user.role });
  const refreshToken = genrateRefreshToken({ id: user._id, role: user.role });

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  res.status(200).json({ message: "login successfully", data: user, accessToken, refreshToken });
};

export const getAccessToken = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new CustomError("No refresh token provided", 403));

  const user = await User.findOne({ refreshToken });
  if (!user)
    return next(new CustomError("User not found", 404));

  const isMatch = verifyRefreshToken(refreshToken);
  if (isMatch === null)
    return next(new CustomError("Invalid refresh token", 403))

  const newAccessToken = genrateAccessToken({ id: user._id, role: user.role });
  res.status(201).json({ message: "Created Access Token Successfully", accessToken: newAccessToken });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken)
    return next(new CustomError("No refresh token provided", 403));

  const user = await User.findOne({ refreshToken });
  if (!user)
    return next(new CustomError("User not found", 404));

  user.refreshToken = null;
  await user.save();

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });
  res.status(200).json({ message: "Logout successfully" });
}