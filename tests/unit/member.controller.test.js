import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import memberController from "../../src/controllers/member.controller.js";

// 1. On crée une application Express minimaliste pour le test
const app = express();
app.use(express.json());
// Simulation du middleware qui injecte req.data (comme ton validateur le fait)
app.post(
	"/register",
	(req, res, next) => {
		req.data = req.body;
		next();
	},
	memberController.register,
);

app.get("/me", (req, res, next) => { req.user = { id: 1 }; next(); }, memberController.getConsumer);
app.get("/:id", (req, res, next) => { req.params = { id: req.params.id }; next(); }, memberController.getById);
app.put("/me", (req, res, next) => { req.user = { id: 1 }; req.data = req.body; next(); }, memberController.updateConsumer);
app.put("/:id", (req, res, next) => { req.params = { id: req.params.id }; req.data = req.body; next(); }, memberController.updateById);
app.get("/", (req, res, next) => { req.validatedQuery = req.query; next(); }, memberController.getAll);

// 2. On mock les services
vi.mock("../../src/services/member.service.js");
vi.mock("../../src/services/mail.service.js");

import memberService from "../../src/services/member.service.js";
import { sendTemplatedEmail } from "../../src/services/mail.service.js";

describe("Member Controller - Register", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("devrait créer un membre et envoyer un email de bienvenue", async () => {
		const mockMember = {
			id: 1,
			username: "chessmaster",
			email: "test@example.com",
		};

		// Configuration du comportement du mock
		memberService.create.mockResolvedValue(mockMember);
		sendTemplatedEmail.mockResolvedValue(true);

		const response = await request(app).post("/register").send({
			username: "chessmaster",
			email: "test@example.com",
			password: "password123",
		});

		// Assertions
		expect(response.status).toBe(201);
		expect(response.body.message).toBe("Member created successfully");
		expect(response.body.emailSent).toBe(true);

		// Vérifie que le service a bien été appelé
		expect(memberService.create).toHaveBeenCalled();
		expect(sendTemplatedEmail).toHaveBeenCalledWith(
			"test@example.com",
			"Welcome to Checkmate!",
			"welcome",
			expect.any(Object),
		);
	});

	it("devrait répondre avec emailSent: false si l'envoi d'email échoue", async () => {
		memberService.create.mockResolvedValue({
			username: "user",
			email: "err@test.com",
		});
		// Simuler une erreur d'email
		sendTemplatedEmail.mockRejectedValue(new Error("SMTP Error"));

		const response = await request(app)
			.post("/register")
			.send({ username: "user", email: "err@test.com" });

		expect(response.status).toBe(201);
		expect(response.body.emailSent).toBe(false);
	});
});

describe("Member Controller - Other Routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("devrait retourner le profil du membre connecté (getConsumer)", async () => {
		memberService.getById.mockResolvedValue({ id: 1, username: "user1", email: "user1@test.com" });
		const response = await request(app).get("/me");
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("user1");
		expect(memberService.getById).toHaveBeenCalledWith(1);
	});

	it("devrait retourner le profil par id (getById)", async () => {
		memberService.getById.mockResolvedValue({ id: 2, username: "user2", email: "user2@test.com" });
		const response = await request(app).get("/2");
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("user2");
		expect(memberService.getById).toHaveBeenCalledWith("2");
	});

	it("devrait mettre à jour le membre connecté (updateConsumer)", async () => {
		memberService.update.mockResolvedValue({ id: 1, username: "new_user", email: "new@test.com" });
		const response = await request(app).put("/me").send({ username: "new_user" });
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("new_user");
		expect(memberService.update).toHaveBeenCalledWith(1, { username: "new_user" });
	});

	it("devrait mettre à jour un membre par id (updateById)", async () => {
		memberService.update.mockResolvedValue({ id: 3, username: "user3_new", email: "user3@test.com" });
		const response = await request(app).put("/3").send({ username: "user3_new" });
		expect(response.status).toBe(200);
		expect(response.body.data.username).toBe("user3_new");
		expect(memberService.update).toHaveBeenCalledWith("3", { username: "user3_new" });
	});

	it("devrait lister les membres en paginant (getAll)", async () => {
		memberService.getAll.mockResolvedValue({
			members: [{ id: 1, username: "user1" }, { id: 2, username: "user2" }],
			count: 2
		});
		const response = await request(app).get("/?page=1&limit=10");
		expect(response.status).toBe(200);
		expect(response.body.data).toHaveLength(2);
		expect(response.body.total).toBe(2);
		expect(memberService.getAll).toHaveBeenCalledWith(
			{ username: undefined, email: undefined, birthdate: undefined, gender: undefined, elo: undefined },
			{ page: "1", limit: "10", sortBy: undefined, sortOrder: undefined }
		);
	});
});
