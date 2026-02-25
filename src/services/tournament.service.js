import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import db from "../database/index.js";
import {
	InvalidEloError,
	InvalidEndRegistrationDateError,
	InvalidNumberOfPlayerError,
	PlayerAlreadyRegisteredError,
	PlayerIsOutOfEloRangeError,
	PlayerIsOutOfTheCategoriesError,
	RegistrationClosedError,
	TournamentIsWomenOnlyError,
	TournamentNotFoundError,
} from "../custom-errors/tournament.error.js";
import { CategoryNotFoundError } from "../custom-errors/category.error.js";
import { MemberNotFoundError } from "../custom-errors/member.error.js";

dayjs.extend(isSameOrBefore);

const tournamentService = {
	create: async data => {
		// check number of players
		if (data.minPlayers > data.maxPlayers) {
			throw new InvalidNumberOfPlayerError();
		}

		// check ELO range
		if (data.minElo > data.maxElo) {
			throw new InvalidEloError();
		}

		// check end registration date
		const validEndRegistrationDate = dayjs()
			.add(data.minPlayers, "day")
			.isSameOrBefore(dayjs(data.endRegistrationDate));
		if (!validEndRegistrationDate) {
			throw new InvalidEndRegistrationDateError();
		}

		// find all the categories
		const promises = data.categories.map(categoryId =>
			db.Category.findByPk(categoryId),
		);
		const categories = await Promise.all(promises);
		// check if all categories exist
		if (categories.includes(null)) {
			throw new CategoryNotFoundError();
		}

		// create the tournament
		const newTournament = await db.Tournament.create(data);

		// associate the tournament with the categories
		await newTournament.addCategories(categories);

		return newTournament;
	},

	participate: async (tournamentId, playerId) => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		const player = await db.Member.findByPk(playerId);
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

		await tournament.addPlayers(player);
	},
};

export default tournamentService;
