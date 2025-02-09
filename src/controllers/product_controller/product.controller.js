import cloudinary from "../../config/cloudinary.js";
import Product from "../../models/product_model/product.model.js";
import Category from "../../models/product_model/category.model.js";
import CustomError from "../../utils/customerror.js";

export const createProduct = async (req, res, next) => {
  const { name, description, price, discount, category } = req.body;

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
    name, description, price, discount, category, images: uploadedImages
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

  const products = await Product.find();

  res.status(200).json({ message: "Opration successful", data: products });
};

export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, description, price, discount, category, imagesToDelete } = req.body;

  const product = await Product.findById(productId);
  if (!product)
    return next(new CustomError("Product not found", 404));

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = price || product.price;
  product.discount = discount || product.discount;

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