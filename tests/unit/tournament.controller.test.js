import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import tournamentController from "../../src/controllers/tournament.controller.js";
import tournamentService from "../../src/services/tournament.service.js";

const app = express();
app.use(express.json());

// Middlewares setup
app.post(
	"/tournament",
	(req, res, next) => {
		req.data = req.body;
		next();
	},
	tournamentController.create,
);

app.delete("/tournament/:id", tournamentController.delete);

app.get(
	"/tournament",
	(req, res, next) => {
		req.validatedQuery = req.query;
		req.user = { id: 1 };
		next();
	},
	tournamentController.getAll,
);

app.get(
	"/tournament/:id",
	(req, res, next) => {
		req.user = { id: 1 };
		next();
	},
	tournamentController.getById,
);

app.post(
	"/tournament/:id/participate",
	(req, res, next) => {
		req.data = req.body;
		req.user = { id: 1 };
		next();
	},
	tournamentController.participate,
);

app.delete(
	"/tournament/:id/participate",
	(req, res, next) => {
		req.data = req.body;
		req.user = { id: 1 };
		next();
	},
	tournamentController.unparticipate,
);

app.post("/tournament/:id/start", tournamentController.start);

app.post("/tournament/:id/next-round", tournamentController.nextRound);

app.get(
	"/tournament/:id/players/:playerId/score",
	tournamentController.scoreOfPlayer,
);

app.get(
	"/tournament/:id/players/scores",
	tournamentController.allPlayersScores,
);

app.get(
	"/tournament/:id/matches/current-round",
	tournamentController.getCurrentRoundMatches,
);

vi.mock("../../src/services/tournament.service.js");

describe("Tournament Controller", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("create", () => {
		it("should create a tournament and return 201 with DTO", async () => {
			const mockTournament = {
				id: 1,
				name: "Test Tournament",
				categories: [],
			};
			const reqData = { name: "Test Tournament" };

			tournamentService.create.mockResolvedValue(mockTournament);

			const response = await request(app)
				.post("/tournament")
				.send(reqData);

			expect(response.status).toBe(201);
			expect(response.body.data).toHaveProperty("id", 1);
			expect(response.body.data).toHaveProperty(
				"name",
				"Test Tournament",
			);
			expect(tournamentService.create).toHaveBeenCalledWith(reqData);
		});
	});

	describe("delete", () => {
		it("should delete tournament and return 204", async () => {
			tournamentService.delete.mockResolvedValue([1, 2]);

			const response = await request(app).delete("/tournament/1");

			expect(response.status).toBe(204);
			expect(tournamentService.delete).toHaveBeenCalledWith(1);
		});
	});

	describe("getAll", () => {
		it("should return paginated tournaments with 200", async () => {
			const mockTournaments = [{ id: 1, name: "T1", categories: [] }];
			tournamentService.getAll.mockResolvedValue({
				tournaments: mockTournaments,
				count: 1,
			});

			const response = await request(app).get(
				"/tournament?name=T1&offset=0&limit=10",
			);

			expect(response.status).toBe(200);
			expect(response.body.total).toBe(1);
			expect(response.body.data[0]).toHaveProperty("id", 1);
			expect(tournamentService.getAll).toHaveBeenCalledWith(
				{
					name: "T1",
					location: undefined,
					minElo: undefined,
					maxElo: undefined,
					fitElo: undefined,
					womenOnly: undefined,
					fromDate: undefined,
				},
				{
					offset: "0",
					limit: "10",
					sortBy: undefined,
					sortOrder: undefined,
				},
				{ id: 1 },
			);
		});
	});

	describe("getById", () => {
		it("should return tournament details with 200", async () => {
			const mockTournament = {
				id: 1,
				name: "T1",
				categories: [],
				players: [],
				matches: [],
			};
			tournamentService.getById.mockResolvedValue(mockTournament);

			const response = await request(app).get("/tournament/1");

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("id", 1);
			expect(tournamentService.getById).toHaveBeenCalledWith(1, {
				id: 1,
			});
		});

		it("should return 404 if tournament not found", async () => {
			tournamentService.getById.mockResolvedValue(null);

			const response = await request(app).get("/tournament/999");

			expect(response.status).toBe(404);
			expect(response.body.message).toBe("Tournament not found");
		});
	});

	describe("participate", () => {
		it("should let a member participate and return 204", async () => {
			tournamentService.participate.mockResolvedValue(true);

			const response = await request(app)
				.post("/tournament/1/participate")
				.send({ memberId: 2 });

			expect(response.status).toBe(204);
			expect(tournamentService.participate).toHaveBeenCalledWith(1, 2);
		});

		it("should use req.user.id if memberId is not provided", async () => {
			tournamentService.participate.mockResolvedValue(true);

			const response = await request(app)
				.post("/tournament/1/participate")
				.send({});

			expect(response.status).toBe(204);
			expect(tournamentService.participate).toHaveBeenCalledWith(1, 1);
		});
	});

	describe("unparticipate", () => {
		it("should let a member unparticipate and return 204", async () => {
			tournamentService.unparticipate.mockResolvedValue(true);

			const response = await request(app)
				.delete("/tournament/1/participate")
				.send({ memberId: 2 });

			expect(response.status).toBe(204);
			expect(tournamentService.unparticipate).toHaveBeenCalledWith(1, 2);
		});

		it("should use req.user.id if memberId is not provided", async () => {
			tournamentService.unparticipate.mockResolvedValue(true);

			const response = await request(app)
				.delete("/tournament/1/participate")
				.send({});

			expect(response.status).toBe(204);
			expect(tournamentService.unparticipate).toHaveBeenCalledWith(1, 1);
		});
	});

	describe("start", () => {
		it("should start the tournament and return 204", async () => {
			tournamentService.start.mockResolvedValue(true);

			const response = await request(app).post("/tournament/1/start");

			expect(response.status).toBe(204);
			expect(tournamentService.start).toHaveBeenCalledWith(1);
		});
	});

	describe("nextRound", () => {
		it("should proceed to next round and return 204", async () => {
			tournamentService.nextRound.mockResolvedValue(true);

			const response = await request(app).post(
				"/tournament/1/next-round",
			);

			expect(response.status).toBe(204);
			expect(tournamentService.nextRound).toHaveBeenCalledWith(1);
		});
	});

	describe("scoreOfPlayer", () => {
		it("should return score of a player with 200", async () => {
			const mockScore = {
				score: 5,
				victory: 5,
				player: { id: 2, username: "P2" },
			};
			tournamentService.scoreOfPlayer.mockResolvedValue(mockScore);

			const response = await request(app).get(
				"/tournament/1/players/2/score",
			);

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("score", 5);
			expect(response.body.data.player).toHaveProperty("id", 2);
			expect(tournamentService.scoreOfPlayer).toHaveBeenCalledWith(
				1,
				"2",
			);
		});
	});

	describe("allPlayersScores", () => {
		it("should return scores of all players with 200", async () => {
			const mockScores = [
				{ score: 5, victory: 5, player: { id: 2, username: "P2" } },
			];
			tournamentService.allPlayersScores.mockResolvedValue(mockScores);

			const response = await request(app).get(
				"/tournament/1/players/scores",
			);

			expect(response.status).toBe(200);
			expect(response.body.data[0]).toHaveProperty("score", 5);
			expect(tournamentService.allPlayersScores).toHaveBeenCalledWith(1);
		});
	});

	describe("getCurrentRoundMatches", () => {
		it("should return current matches of the round with 200", async () => {
			const mockData = {
				currentRound: 2,
				matches: [
					{
						id: "ecd6a828-5d33-409a-a30d-043a5c990b72",
						round: 2,
						result: null,
						createdAt: "2026-02-26T13:16:56.539Z",
						updatedAt: "2026-02-26T13:16:56.539Z",
						tournamentId: 1,
						whitePlayerId: "3790377b-698c-4bf6-9b9f-0fc5f13b2548",
						blackPlayerId: "eded56ad-12f2-4243-b689-413a8922f34d",
						whitePlayer: {
							id: "3790377b-698c-4bf6-9b9f-0fc5f13b2548",
							username: "Maxime",
							email: "maxime@checkmate.local",
							password:
								"$2b$13$jIb4XSG//VLrsA.sEHQ4f.LM3gWfO3Ja8m9icqvKAFcTP0ihZlmqa",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: "2026-02-26T13:16:49.052Z",
							updatedAt: "2026-02-26T13:16:49.052Z",
						},
						blackPlayer: {
							id: "eded56ad-12f2-4243-b689-413a8922f34d",
							username: "john_doe",
							email: "john@user.local",
							password:
								"$2b$13$wrzsXoN/MbVu6HKtPiKH7uXbQ8xzOHhW7ru0EDFlg4lK4GuLeen86",
							birthdate: "1990-05-15",
							gender: "M",
							elo: 1200,
							role: "user",
							createdAt: "2026-02-26T13:16:47.386Z",
							updatedAt: "2026-02-26T13:16:47.386Z",
						},
					},
					{
						id: "2dd42b64-ca9a-4032-85c8-c33373b49277",
						round: 2,
						result: null,
						createdAt: "2026-02-26T13:16:56.539Z",
						updatedAt: "2026-02-26T13:16:56.539Z",
						tournamentId: 1,
						whitePlayerId: "ca71a848-04a0-4c8c-bdc4-c30b838fdc99",
						blackPlayerId: "748fe240-0a5f-4c8f-bbb2-990981411e96",
						whitePlayer: {
							id: "ca71a848-04a0-4c8c-bdc4-c30b838fdc99",
							username: "jane_smith",
							email: "jane@checkmate.local",
							password:
								"$2b$13$DoZpIosOqLxSai0EOINrDOmXGsoe0ulgTwRXwysHRlm9N4sB9usAK",
							birthdate: "1995-10-20",
							gender: "F",
							elo: 1600,
							role: "user",
							createdAt: "2026-02-26T13:16:47.942Z",
							updatedAt: "2026-02-26T13:16:47.942Z",
						},
						blackPlayer: {
							id: "748fe240-0a5f-4c8f-bbb2-990981411e96",
							username: "timmy",
							email: "timmy@checkmate.local",
							password:
								"$2b$13$dbp3b6HOTf7N.KVgtR7khebFCwi7nroB0LnhCXueGr/59IMRbA51u",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: "2026-02-26T13:16:48.497Z",
							updatedAt: "2026-02-26T13:16:48.497Z",
						},
					},
				],
			};
			tournamentService.getCurrentRoundMatches.mockResolvedValue(
				mockData,
			);

			const response = await request(app).get(
				"/tournament/1/matches/current-round",
			);

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("currentRound", 2);
			expect(response.body.data.matches).toHaveLength(2);
			expect(
				tournamentService.getCurrentRoundMatches,
			).toHaveBeenCalledWith(1);
		});
	});
});
