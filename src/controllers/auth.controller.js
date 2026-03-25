import memberService from "../services/member.service.js";
import { generateToken } from "../utils/jwt.utils.js";

const authController = {
	login: async (req, res) => {
		const { login, password } = req.data;
		if (!login) {
			return res
				.status(400)
				.json({ message: "login (Username or email) is required" });
		}

		const member = await memberService.login(login, password);

		const token = generateToken(member);

		return res.status(200).json({ token });
	},
};

export default authController;
