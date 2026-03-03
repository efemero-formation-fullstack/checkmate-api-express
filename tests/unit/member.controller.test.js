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
