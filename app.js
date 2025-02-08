import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import errorHandler from "./src/middlewares/errorHandler.js";
import connectionDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import usersRoutes from "./src/routes/user.routes.js";

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
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

// Error Handler
app.use(errorHandler);

export default app;