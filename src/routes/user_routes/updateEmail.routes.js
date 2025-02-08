import { Router } from "express";
import * as updateEmailContrroller from "../../controllers/user_controller/email.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/authMiddleware.js";
const router = Router();


router.post("/update-email", auth, expressAsyncHandler(updateEmailContrroller.sendVerificationEmail));

router.get("/confirm-email", expressAsyncHandler(updateEmailContrroller.confirmEmail));


export default router;