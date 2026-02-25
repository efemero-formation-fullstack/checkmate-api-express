import { Router } from "express";
import tournamentController from "../controllers/tournament.controller.js";
import { bodyValidator } from "../middlewares/validator.middleware.js";
import { connected } from "../middlewares/auth.middleware.js";
import { createTournamentValidator } from "../validators/tournament.validator.js";

const tournamentRouter = Router();

tournamentRouter.post(
	"/",
	connected(["admin"]),
	bodyValidator(createTournamentValidator),
	tournamentController.create,
);

export default tournamentRouter;
