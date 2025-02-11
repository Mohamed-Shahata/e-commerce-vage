import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import errorHandler from "./src/middlewares/errorHandler.js";
import connectionDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/user_routes/user.routes.js";
import emailRoutes from "./src/routes/user_routes/updateEmail.routes.js";
import resetPasswordRoutes from "./src/routes/user_routes/resetPassowrd.routes.js";
import categoryRoutes from "./src/routes/product_routes/category.routes.js";
import productRoutes from "./src/routes/product_routes/product.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";

dotenv.config();
connectionDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/resetPassword", resetPasswordRoutes);

// Routes Product
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Routes Payment
app.use("/api/payment", paymentRoutes)


// Error Handler
app.use(errorHandler);

export default app;