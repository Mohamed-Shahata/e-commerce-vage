import cloudinary from "../../config/cloudinary.js";
import User from "../../models/user.model.js";
import CustomError from "../../utils/customerror.js"

export const getUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) return next(new CustomError("User not found", 404));

  res.status(200).json({ message: "Opration successful", data: user });
}

export const getAllUsers = async (req, res, next) => {
  let { page, limit } = req.query;

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const skip = (page - 1) * limit;

  const users = await User.find().skip(skip).limit(limit);

  // Count Users
  const total = await User.countDocuments();

  res.status(200).json({ message: "Operation successful", data: users, totalPages: Math.ceil(total / limit) });
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;

  const user = await User.findById(userId);
  if (!user) return next(new CustomError("User not found", 404));

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.phoneNumber = phoneNumber || user.phoneNumber;

  if (req.files && req.files.image) {
    if (user.image && user.image.publicId) {
      if (req?.files.image) {
        await cloudinary.uploader.destroy(user.image.publicId);

        const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
          folder: "users"
        });
        user.image.url = result.secure_url;
        user.image.publicId = result.public_id;
        await user.save();
      }
    } else {
      const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "users"
      });
      user.image.url = result.secure_url;
      user.image.publicId = result.public_id;
      await user.save();
    }
  }
  res.status(200).json({ message: "Operation successful", data: user })
}

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) return next(new CustomError("User not found", 404));

  if (user.image && user.image.publicId) {
    await cloudinary.uploader.destroy(user.image.publicId);
  }
  res.status(200).json({ message: "Delete user successful" })
}