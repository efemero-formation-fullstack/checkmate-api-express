import { Router } from "express";
import tournamentController from "../controllers/tournament.controller.js";
import {
	bodyValidator,
	queryValidator,
} from "../middlewares/validator.middleware.js";
import { connected } from "../middlewares/auth.middleware.js";
import {
	createTournamentValidator,
	getAllTournamentsValidator,
	registerTournamentValidator,
} from "../validators/tournament.validator.js";

const tournamentRouter = Router();

// create tournament
tournamentRouter.post(
	"/",
	connected(["admin"]),
	bodyValidator(createTournamentValidator),
	tournamentController.create,
);

// delete tournament
tournamentRouter.delete(
	"/:id",
	connected(["admin"]),
	tournamentController.delete,
);

// get all tournaments
tournamentRouter.get(
	"/",
	queryValidator(getAllTournamentsValidator),
	tournamentController.getAll,
);

// get tournament details
tournamentRouter.get("/:id", tournamentController.getById);

// register connected user to tournament
tournamentRouter.post(
	"/:id/join",
	connected(),
	tournamentController.participate,
);

// register user to tournament by admin
tournamentRouter.post(
	"/:id/register",
	connected(["admin"]),
	bodyValidator(registerTournamentValidator),
	tournamentController.participate,
);

// unregister connected user from tournament
tournamentRouter.post(
	"/:id/leave",
	connected(),
	tournamentController.unparticipate,
);

// unregister user from tournament by admin
tournamentRouter.post(
	"/:id/unregister",
	connected(["admin"]),
	bodyValidator(registerTournamentValidator),
	tournamentController.unparticipate,
);

// start tournament
tournamentRouter.post(
	"/:id/start",
	connected(["admin"]),
	tournamentController.start,
);

// next round
tournamentRouter.patch(
	"/:id/next-round",
	connected(["admin"]),
	tournamentController.nextRound,
);

// get score of a player in a tournament
tournamentRouter.get(
	"/:id/score/:playerId",
	tournamentController.scoreOfPlayer,
);

// get all players scores in a tournament
tournamentRouter.get("/:id/scores", tournamentController.allPlayersScores);

// get current round matches
tournamentRouter.get(
	"/:id/current-round-matches",
	tournamentController.getCurrentRoundMatches,
);

export default tournamentRouter;
