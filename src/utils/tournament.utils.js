import dayjs from "dayjs";
import { MemberNotFoundError } from "../custom-errors/member.error.js";
import {
	PlayerAlreadyRegisteredError,
	PlayerIsOutOfEloRangeError,
	RegistrationClosedError,
	TournamentIsFullError,
	TournamentIsWomenOnlyError,
	TournamentNotFoundError,
} from "../custom-errors/tournament.error.js";
import db from "../database/index.js";

export const isMemberRegisteredToTournament = async (
	tournamentId,
	memberId,
) => {
	const [result] = await db.sequelize.query(
		`SELECT 1 FROM "TournamentMembers" tm
        WHERE tm."tournamentId" = :tournamentId AND tm."memberId" = :userId`,
		{ replacements: { tournamentId, userId: memberId } },
	);
	return result.length > 0;
};

export const canMemberRegisterToTournament = async (tournamentId, memberId) => {
	const tournament = await db.Tournament.findByPk(tournamentId);
	if (!tournament) {
		throw new TournamentNotFoundError();
	}

	const player = await db.Member.findByPk(memberId);
	if (!player) {
		throw new MemberNotFoundError();
	}

	// check if the player is already registered in the tournament
	const isAlreadyRegistered = await tournament.hasPlayers(player);
	if (isAlreadyRegistered) {
		throw new PlayerAlreadyRegisteredError();
	}

	// check if the tournament is still open for registration
	if (dayjs().isAfter(dayjs(tournament.endRegistrationDate))) {
		throw new RegistrationClosedError();
	}

	// check if the tournament is women only and if the player is a woman
	if (tournament.womenOnly && player.gender !== "F") {
		throw new TournamentIsWomenOnlyError();
	}

	// check if the player have enough ELO to participate
	if (player.elo < tournament.minElo || player.elo > tournament.maxElo) {
		throw new PlayerIsOutOfEloRangeError();
	}

	// check if the player is in the tournament's category
	const tournamentCategories = await tournament.getCategories();
	// if the tournament has categories, check if the player belongs to at least one of them
	if (tournamentCategories.length) {
		// get the minimum and maximum age of the tournament's categories
		const minAge = Math.min(
			...tournamentCategories.map(category => category.minAge),
		);
		const maxAge = Math.max(
			...tournamentCategories.map(category => category.maxAge),
		);

		// compute the player's age
		const playerAge = dayjs().diff(dayjs(player.birthDate), "year");
		if (playerAge < minAge || playerAge > maxAge) {
			throw new PlayerIsOutOfTheCategoriesError();
		}
	}

	// check the number of players already registered in the tournament
	const nbrOfPlayers = await tournament.countPlayers();
	if (nbrOfPlayers >= tournament.maxPlayers) {
		throw new TournamentIsFullError();
	}
};
