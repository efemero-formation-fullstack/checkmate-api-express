import bcrypt from "bcrypt";
import db from "../database/index.js";
import {
	EmailAlreadyExistsError,
	UsernameAlreadyExistsError,
} from "../custom-errors/member.error.js";

const { ENCRYPTION_ROUND } = process.env;

const memberService = {
	create: async data => {
		// check if the email already exists
		const existingUser = await db.Member.findOne({
			where: { email: data.email },
		});
		if (existingUser) {
			throw new EmailAlreadyExistsError();
		}

		// check if username already exists
		const existingUsername = await db.Member.findOne({
			where: { username: data.username },
		});
		if (existingUsername) {
			throw new UsernameAlreadyExistsError();
		}

		// hash the password
		const hashedPassword = await bcrypt.hash(
			data.password,
			+ENCRYPTION_ROUND,
		);
		data.password = hashedPassword;

		// create the user
		const createdMember = await db.Member.create(data);

		return createdMember;
	},
};

export default memberService;
