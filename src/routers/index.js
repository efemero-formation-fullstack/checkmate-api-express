import { Router } from "express";
import memberRouter from "./member.router.js";
import authRouter from "./auth.router.js";

const router = Router();

router.use("/member", memberRouter);
router.use("/auth", authRouter);

export default router;
