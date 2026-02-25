import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { loginValidator } from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/login", bodyValidator(loginValidator), authController.login);

export default authRouter;
