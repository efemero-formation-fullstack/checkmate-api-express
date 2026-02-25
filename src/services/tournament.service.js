import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import db from "../database/index.js";
import {
	InvalidEloError,
	InvalidEndRegistrationDateError,
	InvalidNumberOfPlayerError,
} from "../custom-errors/tournament.error.js";
import { CategoryNotFoundError } from "../custom-errors/category.error.js";

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
};

export default tournamentService;
