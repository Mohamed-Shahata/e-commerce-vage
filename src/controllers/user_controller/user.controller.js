import cloudinary from "../../config/cloudinary.js";
import Product from "../../models/product_model/product.model.js";
import User from "../../models/user.model.js";
import CustomError from "../../utils/customerror.js"
import bcryptjs from "bcryptjs";
import Cart from "../../models/cart.model.js";

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

// Update user address info
export const updateUserAddress = async (req, res, next) => {
  const { userId } = req.params;
  const { streetAddress, country, states, zipCode } = req.body;

  const user = await User.findById(userId);
  if (!user) return next(new CustomError("User not found", 404));

  user.streetAddress = streetAddress || user.streetAddress;
  user.country = country || user.country;
  user.states = states || user.states;
  user.zipCode = zipCode || user.zipCode;

  await user.save();
  res.status(200).json({ message: "Operation successful", data: user })
}

// Update user info
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

// Update Password
export const updatePassword = async (req, res, next) => {
  const { id } = req.user;
  const { oldPass, newPass, confirmPass } = req.body;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  if (!await bcryptjs.compare(oldPass, user.password))
    return next(new CustomError("Old password id wrong", 400));

  if (newPass !== confirmPass)
    return next(new CustomError("New password must be confirm password", 400));

  user.password = newPass;
  await user.save();

  res.status(200).json({ message: "Update password successful" })
}

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  if (!user) return next(new CustomError("User not found", 404));

  if (user.image && user.image.publicId) {
    await cloudinary.uploader.destroy(user.image.publicId);
  }
  res.status(200).json({ message: "Delete user successful" })
};


export const addWishlist = async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;


  const user = await User.findById(id);
  if (!user) return next(new CustomError("User not found", 404));

  const product = await Product.findById(productId);
  if (!product) return next(new CustomError("Product not found", 404));

  if (user.wishlist.includes(product._id)) {
    return res.status(400).json({ message: 'Product already in your wishlist' });
  }

  user.wishlist.push(product._id);
  await user.save();
  res.status(200).json({ message: 'Product added in your whishlist', data: user.wishlist });
}

export const getWishlist = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user) return next(new CustomError("User not found", 404));
  res.status(200).json({ message: 'Opration successful', data: user.wishlist });
}

export const removeWishlist = async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.params;


  const user = await User.findById(id);
  if (!user) return next(new CustomError("User not found", 404));

  user.wishlist = user.wishlist.filter((product) => product.toString() !== productId);
  await user.save();
  res.status(200).json({ message: 'Product remove in your whishlist', data: user.wishlist });
};



export const addToCart = async (req, res, next) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    cart = await Cart.create({ user: user._id, items: [] });

  const existingItem = cart.items.find(item => item.product.toString() === productId);
  if (existingItem)
    existingItem.quantity += quantity;
  else
    cart.items.push({ product: productId, quantity });

  await cart.save();
  res.status(200).json({ message: "Product added to cart", data: cart });
}

export const updateCart = async (req, res, next) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return next(new CustomError("Cart not found", 404));

  const item = cart.items.find(item => item.product.toString() === productId);
  if (!item)
    return next(new CustomError("Product not found", 404));

  item.quantity = quantity;
  await cart.save();
  res.status(200).json({ message: "Update successful", data: cart });
}


export const deleteCart = async (req, res, next) => {
  const { id } = req.user;
  const { productId } = req.body;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return next(new CustomError("Cart not found", 404));

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  res.status(200).json({ message: "Delete product from cart", data: cart });
}

export const getCart = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user)
    return next(new CustomError("User not found", 404));

  let cart = await Cart.findOne({ user: user._id });
  if (!cart)
    return next(new CustomError("Cart not found", 404));
  res.status(200).json({ message: "Opration successful", data: cart });
}