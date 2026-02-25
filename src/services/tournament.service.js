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
	TournamentAlreadyStartedError,
	TournamentIsWomenOnlyError,
	TournamentNotFoundError,
} from "../custom-errors/tournament.error.js";
import { CategoryNotFoundError } from "../custom-errors/category.error.js";
import { MemberNotFoundError } from "../custom-errors/member.error.js";
import { Op } from "sequelize";

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

	delete: async tournamentId => {
		const tournament = await db.Tournament.findByPk(tournamentId);
		if (!tournament) {
			throw new TournamentNotFoundError();
		}

		if (tournament.status !== "waiting") {
			throw new TournamentAlreadyStartedError();
		}

		const players = await tournament.getPlayers();

		await tournament.destroy();
		return players;
	},

	getAll: async (filter, pagination) => {
		const where = {};

		if (filter) {
			if (filter.name) {
				where.name = { [Op.iLike]: `%${filter.name}%` };
			}

			if (filter.location) {
				where.location = { [Op.iLike]: `%${filter.location}%` };
			}

			if (filter.minElo) {
				where.minElo = { [Op.gte]: filter.minElo };
			}

			if (filter.maxElo) {
				where.maxElo = { [Op.lte]: filter.maxElo };
			}

			if (filter.fitElo) {
				if (filter.fitElo && !where.minElo && !where.maxElo) {
					where.minElo = { [Op.lte]: filter.fitElo };
					where.maxElo = { [Op.gte]: filter.fitElo };
				} else {
					const fitEloAnd = [
						{
							minElo: { [Op.lte]: filter.fitElo },
							maxElo: { [Op.gte]: filter.fitElo },
						},
					];
					if (where.minElo) {
						fitEloAnd.push({ minElo: where.minElo });
						delete where.minElo;
					}
					if (where.maxElo) {
						fitEloAnd.push({ maxElo: where.maxElo });
						delete where.maxElo;
					}
					where[Op.and] = fitEloAnd;
				}
			}

			if (filter.womenOnly) {
				where.womenOnly = true;
			}

			if (filter.fromDate) {
				where.endRegistrationDate = { [Op.gte]: filter.fromDate };
			}
		}

		const order = [];
		if (pagination) {
			if (pagination.sortBy) {
				order.push([pagination.sortBy, pagination.sortOrder || "ASC"]);
			}
		} else {
			order.push(["registrationDate", "DESC"]);
		}

		// find all tournaments with the specified filters and pagination
		let { rows: tournaments, count } = await db.Tournament.findAndCountAll({
			where,
			order,
			include: [
				{
					model: db.Category,
					as: "categories",
				},
			],
			limit: pagination?.limit || 20,
			offset: pagination?.offset || 0,
			distinct: true, // to avoid counting duplicates when a tournament has multiple categories
		});

		// count the number of players for each tournament and add it to the tournament object
		const promises = tournaments.map(async tournament => {
			tournament.nbrOfPlayers = await tournament.countPlayers();
			return tournament;
		});
		tournaments = await Promise.all(promises);

		return { tournaments, count };
	},

	getById: async tournamentId => {
		const tournament = await db.Tournament.findByPk(tournamentId, {
			include: [
				{
					model: db.Category,
					as: "categories",
				},
				{
					model: db.Member,
					as: "players",
					through: { attributes: [] }, // to exclude the join table attributes
				},
				{
					model: db.Match,
					as: "matches",
					include: [
						{
							model: db.Member,
							as: "whitePlayer",
						},
						{
							model: db.Member,
							as: "blackPlayer",
						},
					],
				},
			],
		});
		if (!tournament) {
			throw new TournamentNotFoundError();
		}
		return tournament;
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
