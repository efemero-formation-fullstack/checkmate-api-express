import tournamentService from "../services/tournament.service.js";

const tournamentController = {
	create: async (req, res) => {
		const newTournament = await tournamentService.create(req.data);

		res.status(201).json({
			data: newTournament,
		});
	},
};

export default tournamentController;
