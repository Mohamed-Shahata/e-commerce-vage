import { Router } from "express";
import * as userContrller from "../../controllers/user_controller/user.controller.js";
import { auth, checkAccountOwner } from "../../middlewares/authMiddleware.js";
import expressAsyncHandler from "express-async-handler";
import { validateorUpdateUser } from "../../middlewares/validators/userValidator.js";
const router = Router();


router.get("/", auth, expressAsyncHandler(userContrller.getAllUsers));

router.get("/:userId", expressAsyncHandler(userContrller.getUser));

router.patch("/:userId", auth, checkAccountOwner, validateorUpdateUser, expressAsyncHandler(userContrller.updateUser));

router.delete("/:userId", auth, checkAccountOwner, expressAsyncHandler(userContrller.deleteUser));




export default router;