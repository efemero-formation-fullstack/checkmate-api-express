import bcrypt from "bcrypt";
import db from "../database/index.js";
import {
	EmailAlreadyExistsError,
	InvalidCredentialError,
	MemberNotFoundError,
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
	login: async (username, email, password) => {
		let member = null;
		if (username) {
			member = await db.Member.findOne({ where: { username } });
		} else {
			member = await db.Member.findOne({ where: { email } });
		}

		if (!member) {
			throw new InvalidCredentialError();
		}

		const isPasswordValid = await bcrypt.compare(password, member.password);
		if (!isPasswordValid) {
			throw new InvalidCredentialError();
		}

		return member;
	},
	getById: async id => {
		const member = await db.Member.findOne({ where: { id } });
		if (!member) {
			throw new MemberNotFoundError();
		}
		return member;
	},
	update: async (id, data) => {
		const member = await db.Member.findOne({ where: { id } });
		if (!member) {
			throw new MemberNotFoundError();
		}

		if (data.email && data.email !== member.email) {
			// check if the email already exists
			const existingUser = await db.Member.findOne({
				where: { email: data.email },
			});
			if (existingUser) {
				throw new EmailAlreadyExistsError();
			}
		}

		if (data.username && data.username !== member.username) {
			// check if username already exists
			const existingUsername = await db.Member.findOne({
				where: { username: data.username },
			});
			if (existingUsername) {
				throw new UsernameAlreadyExistsError();
			}
		}

		// update the user
		const updatedMember = await member.update(data);
		return updatedMember;
	},
};

export default memberService;
