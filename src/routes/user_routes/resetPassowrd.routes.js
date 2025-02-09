import { Router } from "express";
import * as resetPasswordContrroller from "../../controllers/user_controller/resetPassword.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/authMiddleware.js";
const router = Router();


router.post("/reset-password", expressAsyncHandler(resetPasswordContrroller.sendVerificationCode));

router.post("/verify-code", expressAsyncHandler(resetPasswordContrroller.verifyVerificationCode));

router.post("/change-password", auth, expressAsyncHandler(resetPasswordContrroller.changPassword));


export default router;