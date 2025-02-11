import { Router } from "express";
import * as paymentController from "../controllers/payment.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth, checkAccountOwner } from "../middlewares/authMiddleware.js";
const router = Router();


router.post("/:userId", auth, checkAccountOwner, expressAsyncHandler(paymentController.createPayment));

export default router;