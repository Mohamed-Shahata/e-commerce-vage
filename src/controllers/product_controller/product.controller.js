import cloudinary from "../../config/cloudinary.js";
import Product from "../../models/product_model/product.model.js";
import Category from "../../models/product_model/category.model.js";
import CustomError from "../../utils/customerror.js";
import User from "../../models/user.model.js";

export const createProduct = async (req, res, next) => {
  const { name, description, price, discount, category, stockQuantity } = req.body;


  if (category) {
    const isCategory = await Category.findById(category);
    if (!isCategory)
      return next(new CustomError("Category not found", 404));
  }


  if (!req.files || !req.files.images)
    return next(new CustomError("Must be upload images of product", 400));

  let uploadedImages = [];

  const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

  for (let image of images) {
    const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
      folder: "products"
    });

    uploadedImages.push({
      publicId: uploadResponse.public_id,
      url: uploadResponse.secure_url
    });
  };

  const product = await Product.create({
    name, description, price, discount, category, images: uploadedImages, stockQuantity
  });
  res.status(201).json({ message: "Create product successful", data: product });
};

export const getProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  res.status(200).json({ message: "Opration successful", data: product });
}

export const getProducts = async (req, res, next) => {
  const { minPrice, maxPrice, category, minRating } = req.query;

  let filter = {};

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  };

  if (category) {
    filter.category = category;
  };

  if (minRating) {
    filter.rate = { $gte: Number(minRating) };
  }

  const products = await Product.find(filter).populate("category");

  res.status(200).json({ message: "Opration successful", data: products });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, discount, category, imagesToDelete, stockQuantity } = req.body;

  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discount = discount || product.discount;
  product.stockQuantity = stockQuantity || product.stockQuantity;

  if (category) {
    const isCategory = await Category.findById(category);
    if (!isCategory)
      return next(new CustomError("Category not found", 404));

    product.category = category || product.category;
  }


  if (imagesToDelete && imagesToDelete.length > 0) {
    const imagesArray = Array.isArray(imagesToDelete) ? imagesToDelete : [imagesToDelete];
    for (let publicId of imagesArray) {
      await cloudinary.uploader.destroy(publicId);
      product.images = product.images.filter((img) => img.publicId !== publicId)
    }
  };

  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
    for (let image of images) {
      const uploadResponse = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "products"
      });
      product.images.push({
        publicId: uploadResponse.public_id,
        url: uploadResponse.secure_url
      })
    }
  }
  await product.save();
  res.status(200).json({ message: "Update successful", data: product });
};

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  for (let image of product.images) {
    await cloudinary.uploader.destroy(image.publicId);
  };
  await product.deleteOne();
  res.status(200).json({ message: "Delete successful" });
}

export const searchProducts = async (req, res, next) => {
  const { keyword } = req.query;

  if (!keyword)
    return next(new CustomError("keyword is empty", 404));

  const products = await Product.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } }
    ]
  });
  res.status(200).json({ message: "Opration successful", data: products });
};


export const addReview = async (req, res, next) => {
  const { productId } = req.params;
  const { userId, text } = req.body;


  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  const user = await User.findById(userId);
  if (!user)
    return next(new CustomError("User not found", 404));

  product.review.push({
    user: user._id,
    text
  });
  await product.save();
  res.status(200).json({ message: "Created review successful", data: product.review });
}


export const updateReview = async (req, res, next) => {
  const { productId, reviewId } = req.params;
  const { text } = req.body;


  let product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  const review = product.review.id(reviewId);
  if (!review)
    return next(new CustomError("Review not found", 404));

  review.text = text;
  await product.save();
  res.status(200).json({ message: "Update review successful", data: product.review });
}


export const deleteReview = async (req, res, next) => {
  const { productId, reviewId } = req.params;

  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  product.review = product.review.filter((rev) => rev._id.toString() !== reviewId);
  await product.save();
  res.status(200).json({ message: "Delete review successful", data: product.review });
}