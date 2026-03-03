import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import db from "../../src/database/index.js";
import memberService from "../../src/services/member.service.js";
import {
	EmailAlreadyExistsError,
	UsernameAlreadyExistsError,
	InvalidCredentialError,
} from "../../src/custom-errors/member.error.js";

// On mocke les dépendances externes
vi.mock("../../src/database/index.js", () => ({
	default: {
		Member: {
			findOne: vi.fn(),
			create: vi.fn(),
		},
	},
}));

describe("Member Service", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Simule la variable d'environnement pour le hachage
		process.env.ENCRYPTION_ROUND = "10";
	});

	describe("create", () => {
		it("devrait créer un membre avec un mot de passe haché", async () => {
			const userData = {
				username: "newuser",
				email: "test@test.com",
				password: "plainpassword",
			};

			// Configuration des mocks : aucun utilisateur existant
			db.Member.findOne.mockResolvedValue(null);
			db.Member.create.mockResolvedValue({
				...userData,
				password: "hashed_password",
				id: 1,
			});

			const result = await memberService.create(userData);

			expect(db.Member.findOne).toHaveBeenCalledTimes(2); // Vérifie email ET username
			expect(result.password).toBe("hashed_password");
			expect(db.Member.create).toHaveBeenCalled();
		});

		it("devrait lever une erreur si l'email existe déjà", async () => {
			db.Member.findOne.mockResolvedValue({
				id: 1,
				email: "exists@test.com",
			});

			await expect(
				memberService.create({ email: "exists@test.com" }),
			).rejects.toThrow(EmailAlreadyExistsError);
		});

		it("devrait lever une erreur si le username existe déjà", async () => {
			// Premier appel (email) -> null, Deuxième appel (username) -> trouvé
			db.Member.findOne
				.mockResolvedValueOnce(null)
				.mockResolvedValueOnce({ id: 1, username: "taken" });

			await expect(
				memberService.create({
					username: "taken",
					email: "ok@test.com",
				}),
			).rejects.toThrow(UsernameAlreadyExistsError);
		});
	});

	describe("login", () => {
		it("devrait retourner le membre si les identifiants sont valides", async () => {
			const mockMember = {
				username: "user1",
				password: bcrypt.hashSync("password123", 10),
			};

			db.Member.findOne.mockResolvedValue(mockMember);

			const result = await memberService.login(
				"user1",
				null,
				"password123",
			);
		});

		it("devrait lever une erreur si l'utilisateur n'est pas trouvé", async () => {
			db.Member.findOne.mockResolvedValue(null);

			await expect(
				memberService.login("unknown", null, "password"),
			).rejects.toThrow(InvalidCredentialError);
		});

		it("devrait lever une erreur si le mot de passe est incorrect", async () => {
			db.Member.findOne.mockResolvedValue({ password: "hash" });

			await expect(
				memberService.login("user", null, "wrong_pass"),
			).rejects.toThrow(InvalidCredentialError);
		});
	});
});
