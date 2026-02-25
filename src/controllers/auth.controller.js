import memberService from "../services/member.service.js";
import { generateToken } from "../utils/jwt.utils.js";

const authController = {
	login: async (req, res) => {
		const { username, email, password } = req.data;
		if (!username && !email) {
			return res
				.status(400)
				.json({ message: "Username or email is required" });
		}

		const member = await memberService.login(username, email, password);

		const token = generateToken(member);

		return res.status(200).json({ token });
	},
};

export default authController;
