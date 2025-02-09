import { Router } from "express";
import * as categoryController from "../../controllers/product_controller/category.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRole } from "../../middlewares/authMiddleware.js";

const router = Router();


router.get("/", auth, expressAsyncHandler(categoryController.getCategories));

router.get("/:categoryId", auth, expressAsyncHandler(categoryController.geteCategory));

router.post("/create", auth, authorizedRole("admin"), expressAsyncHandler(categoryController.createCategory));

router.put("/:categoryId", auth, authorizedRole("admin"), expressAsyncHandler(categoryController.updateCategory));

router.delete("/:categoryId", auth, authorizedRole("admin"), expressAsyncHandler(categoryController.deleteCategory));


export default router;