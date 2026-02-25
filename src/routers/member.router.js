import { Router } from "express";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { registerValidator } from "../validators/member.validator.js";
import memberController from "../controllers/member.controller.js";
import { connected } from "../middlewares/auth.middleware.js";

const memberRouter = Router();

memberRouter.post(
	"/",
	//   connected(["admin"]),
	bodyValidator(registerValidator),
	memberController.register,
);

export default memberRouter;
