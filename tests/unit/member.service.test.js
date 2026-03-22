import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcrypt";
import db from "../../src/database/index.js";
import memberService from "../../src/services/member.service.js";
import {
	EmailAlreadyExistsError,
	UsernameAlreadyExistsError,
	InvalidCredentialError,
	MemberNotFoundError,
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

	describe("getById", () => {
		it("devrait retourner le membre si l'id est valide", async () => {
			const mockMember = {
				id: 1,
				username: "user1",
				password: "hashed_password",
			};

			db.Member.findOne.mockResolvedValue(mockMember);

			const result = await memberService.getById(1);

			expect(db.Member.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
			expect(result).toEqual(mockMember);
		});

		it("devrait lever une erreur si l'id est invalide", async () => {
			db.Member.findOne.mockResolvedValue(null);

			await expect(memberService.getById("invalid-id")).rejects.toThrow(
				MemberNotFoundError,
			);
		});
	});

	describe("update", () => {
		it("devrait mettre à jour et retourner le membre", async () => {
			const mockMember = {
				id: 1,
				username: "oldname",
				email: "old@test.com",
				update: vi.fn().mockResolvedValue({
					id: 1,
					username: "newname",
					email: "new@test.com",
				}),
			};

			db.Member.findOne.mockResolvedValueOnce(mockMember); // find user by id
			db.Member.findOne.mockResolvedValueOnce(null); // check email uniqueness
			db.Member.findOne.mockResolvedValueOnce(null); // check username uniqueness

			const result = await memberService.update(1, {
				username: "newname",
				email: "new@test.com",
			});

			expect(db.Member.findOne).toHaveBeenCalledTimes(3);
			expect(mockMember.update).toHaveBeenCalledWith({
				username: "newname",
				email: "new@test.com",
			});
			expect(result.username).toBe("newname");
		});

		it("devrait lever une erreur si le membre n'existe pas", async () => {
			db.Member.findOne.mockResolvedValueOnce(null);
			await expect(memberService.update(999, {})).rejects.toThrow(
				MemberNotFoundError,
			);
		});

		it("devrait lever une erreur si le nouvel email est déjà pris", async () => {
			db.Member.findOne.mockResolvedValueOnce({
				id: 1,
				email: "old@test.com",
			}); // the user
			db.Member.findOne.mockResolvedValueOnce({
				id: 2,
				email: "taken@test.com",
			}); // email taken
			
			await expect(
				memberService.update(1, { email: "taken@test.com" }),
			).rejects.toThrow(EmailAlreadyExistsError);
		});

		it("devrait lever une erreur si le nouveau nom d'utilisateur est déjà pris", async () => {
			db.Member.findOne.mockResolvedValueOnce({
				id: 1,
				username: "old",
				email: "old@test.com",
			}); // the user
			// email not changed or not provided -> skip email check
			db.Member.findOne.mockResolvedValueOnce({
				id: 2,
				username: "taken",
			}); // username taken
			
			await expect(
				memberService.update(1, { username: "taken" }),
			).rejects.toThrow(UsernameAlreadyExistsError);
		});
	});

	describe("getAll", () => {
		it("devrait retourner la liste des membres avec le compte total", async () => {
			const mockMembers = [{ id: 1, username: "user1" }, { id: 2, username: "user2" }];
			db.Member.findAndCountAll = vi.fn().mockResolvedValue({
				rows: mockMembers,
				count: 2,
			});

			const filter = { username: "user" };
			const pagination = { offset: 0, limit: 10, sortBy: "username", sortOrder: "DESC" };

			const result = await memberService.getAll(filter, pagination);

			expect(db.Member.findAndCountAll).toHaveBeenCalledWith({
				where: filter,
				offset: 0,
				limit: 10,
				order: [["username", "DESC"]],
			});
			expect(result.members).toEqual(mockMembers);
			expect(result.count).toBe(2);
		});
	});
});
