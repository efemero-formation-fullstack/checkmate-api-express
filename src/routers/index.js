import { Router } from "express";
import memberRouter from "./member.router.js";
import authRouter from "./auth.router.js";
import tournamentRouter from "./tournament.router.js";
import matchRouter from "./match.router.js";

const router = Router();

router.use("/member", memberRouter);
router.use("/auth", authRouter);
router.use("/tournament", tournamentRouter);
router.use("/match", matchRouter);

export default router;
