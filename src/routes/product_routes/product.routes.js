import { Router } from "express";
import * as productController from "../../controllers/product_controller/product.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth, authorizedRole } from "../../middlewares/authMiddleware.js";

const router = Router();


router.post("/", auth, authorizedRole('admin'), expressAsyncHandler(productController.createProduct));

router.get("/", expressAsyncHandler(productController.getProducts));

router.get("/:productId", expressAsyncHandler(productController.getProduct));

router.patch("/:productId", auth, authorizedRole('admin'), expressAsyncHandler(productController.updateProduct));

router.delete("/:productId", auth, authorizedRole('admin'), expressAsyncHandler(productController.deleteProduct));



export default router;