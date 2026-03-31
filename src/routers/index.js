import { Router } from "express";
import authRouter from "./auth.router.js";
import matchRouter from "./match.router.js";
import memberRouter from "./member.router.js";
import tournamentRouter from "./tournament.router.js";

const router = Router();

router.use("/error500", (req, resp) => {
	return resp.status(500).end();
});
router.use("/member", memberRouter);
router.use("/auth", authRouter);
router.use("/tournament", tournamentRouter);
router.use("/match", matchRouter);

export default router;
