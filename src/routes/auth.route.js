import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import expressAsyncHandler from "express-async-handler";
import { validateorLogin, validateorRegister } from "../middlewares/validators/userValidator.js";

const router = Router();


router.post("/register", validateorRegister, expressAsyncHandler(authController.register));

router.post("/verifyEmail", expressAsyncHandler(authController.verifyEmail));

router.post("/login", validateorLogin, expressAsyncHandler(authController.login));

router.get("/refreshToken", expressAsyncHandler(authController.getAccessToken));

router.post("/logout", expressAsyncHandler(authController.logout));



export default router;