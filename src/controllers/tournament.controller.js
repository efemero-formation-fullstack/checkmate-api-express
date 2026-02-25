import tournamentService from "../services/tournament.service.js";

const tournamentController = {
	create: async (req, res) => {
		const newTournament = await tournamentService.create(req.data);

		res.status(201).json({
			data: newTournament,
		});
	},
	participate: async (req, res) => {
		const tournamentId = +req.params.id;
		let { memberId } = req.data || {};

		// if memberId is not provided, use the id of the connected user
		if (!memberId) {
			memberId = req.user.id;
		}

		await tournamentService.participate(tournamentId, memberId);

		// TODO send email to the member to confirm his participation

		res.status(204).send();
	},
};

export default tournamentController;
