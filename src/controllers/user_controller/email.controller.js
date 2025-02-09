import User from "../../models/user.model.js";
import sendEmail from "../../services/emailServices.js";
import CustomError from "../../utils/customerror.js";
import jwt from "jsonwebtoken";

export const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;
  const id = req.user.id;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  if (user.email === email)
    return res.status(400).json({ message: "Email already used" })

  const token = jwt.sign({ email, id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  const verificationLink = `${process.env.BASE_URL}/api/email/confirm-email?token=${token}`;
  sendEmail(email, null, "Confirm email",
    `
    <p>click this button</p>
    <a href="${verificationLink}" style="padding: 10px 20px; background: blue; color:white; text-decoration: none; border-radius:5px;">Click Here</a>
    `);
  res.status(200).json({ message: "Send a link on your email" })
};

export const confirmEmail = async (req, res, next) => {
  const { token } = req.query;

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const { id, email } = decoded;
  const user = await User.findByIdAndUpdate(id, { email }, { new: true });
  if (!user)
    return next(new CustomError("User not found", 404));

  res.status(200).json({ message: "Email changed successful" });
}