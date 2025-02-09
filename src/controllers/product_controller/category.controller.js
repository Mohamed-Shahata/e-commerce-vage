import Category from "../../models/product_model/category.model.js"
import CustomError from "../../utils/customerror.js";

export const geteCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category)
    return next(new CustomError("Category not found", 404));

  res.status(200).json({ message: "Delete successful", data: category });
}

export const getCategories = async (req, res, next) => {
  const category = await Category.find();

  res.status(200).json({ message: "Delete successful", data: category });
}

export const createCategory = async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.findOne({ name });
  if (category)
    return next(new CustomError("Category already exsits", 400));

  const newCategory = await Category.create({ name });
  res.status(201).json({ message: "Create successful", data: newCategory });
}

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const category = await Category.findById(categoryId);
  if (!category)
    return next(new CustomError("Category not found", 404));

  category.name = name;
  await category.save();
  res.status(200).json({ message: "Update successful", data: category });
}

export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category)
    return next(new CustomError("Category not found", 404));

  await category.deleteOne();
  res.status(200).json({ message: "Delete successful" });
}