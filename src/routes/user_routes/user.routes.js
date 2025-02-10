import { Router } from "express";
import * as userContrller from "../../controllers/user_controller/user.controller.js";
import { auth, checkAccountOwner } from "../../middlewares/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";
import { validateorUpdateUser, validateorUpdateUserAddress } from "../../middlewares/validators/userValidator.js";
import * as cartContrroller from "../../controllers/user_controller/user.controller.js";
const router = Router();



router.get("/", auth, expressAsyncHandler(userContrller.getAllUsers));

router.get("/:userId", expressAsyncHandler(userContrller.getUser));

router.patch("/:userId", auth, checkAccountOwner, validateorUpdateUser, expressAsyncHandler(userContrller.updateUser));

router.patch("/updateAddress/:userId", auth, checkAccountOwner, validateorUpdateUserAddress, expressAsyncHandler(userContrller.updateUserAddress));

router.post("/updatePassword", auth, expressAsyncHandler(userContrller.updatePassword));

router.delete("/:userId", auth, checkAccountOwner, expressAsyncHandler(userContrller.deleteUser));



router.post("/:userId/wishlist/:productId", auth, checkAccountOwner, expressAsyncHandler(userContrller.addWishlist));

router.get("/:userId/wishlist", auth, checkAccountOwner, expressAsyncHandler(userContrller.getWishlist));

router.delete("/:userId/wishlist/:productId", auth, checkAccountOwner, expressAsyncHandler(userContrller.removeWishlist));



router.post("/:userId/cart", auth, checkAccountOwner, expressAsyncHandler(cartContrroller.addToCart));

router.patch("/:userId/cart", auth, checkAccountOwner, expressAsyncHandler(cartContrroller.updateCart));

router.delete("/:userId/cart", auth, checkAccountOwner, expressAsyncHandler(cartContrroller.deleteCart));

router.get("/:userId/cart", auth, checkAccountOwner, expressAsyncHandler(cartContrroller.getCart));




export default router;