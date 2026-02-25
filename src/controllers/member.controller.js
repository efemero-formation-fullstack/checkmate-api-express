import memberService from "../services/member.service.js";

const memberController = {
	register: async (req, res) => {
		const newMember = await memberService.create(req.data); // req.data is set by the validation middleware

		// TODO send email to the user to confirm the registration

		res.status(204).send();
	},
};

export default memberController;
