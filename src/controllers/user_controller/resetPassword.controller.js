import User from "../../models/user.model.js";
import CustomError from "../../utils/customerror.js";
import sendEmail from "../../services/emailServices.js";
import jwt from "jsonwebtoken";

export const sendVerificationCode = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new CustomError("User not found", 404));

  const RoundNum = Math.floor(100000 + Math.random() * 900000);
  user.verification = RoundNum;
  await user.save();
  sendEmail(email, RoundNum, "Reset Password");
  res.status(200).json({ message: "Check your email" });
}

export const verifyVerificationCode = async (req, res, next) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new CustomError("User not found", 404));

  if (user.verification !== code)
    return next(new CustomError("Code is wrong", 400));

  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

  res.status(200).json({ message: "Opration successful", accessToken: token });
}

export const changPassword = async (req, res, next) => {
  const { id } = req.user;
  const { newPass, confirmNewPass } = req.body;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  if (newPass !== confirmNewPass)
    return next(new CustomError("New password must be equle confirm new password", 400));

  user.password = newPass;
  await user.save();

  res.status(200).json({ message: "Chang passowrd successful" });
}