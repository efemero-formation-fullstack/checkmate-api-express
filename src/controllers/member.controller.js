import { sendTemplatedEmail } from "../services/mail.service.js";
import memberService from "../services/member.service.js";

const memberController = {
	register: async (req, res) => {
		const newMember = await memberService.create(req.data); // req.data is set by the validation middleware

		let emailSent = false;
		try {
			// send email to the user to confirm the registration
			await sendTemplatedEmail(
				newMember.email,
				"Welcome to Checkmate!",
				"welcome", // loads src/templates/welcome.hbs
				{
					username: newMember.username,
					loginUrl: "http://localhost:3000/auth/login", // TODO env variable for the application URL
				},
			);
			emailSent = true;
		} catch (error) {
			console.error("Error sending welcome email:", error);
		}

		res.status(201).send({
			message: "Member created successfully",
			emailSent,
		});
	},
};

export default memberController;
