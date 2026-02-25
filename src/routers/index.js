import { Router } from "express";
import memberRouter from "./member.router.js";
import authRouter from "./auth.router.js";
import tournamentRouter from "./tournament.router.js";

const router = Router();

router.use("/member", memberRouter);
router.use("/auth", authRouter);
router.use("/tournament", tournamentRouter);

export default router;
