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

	describe("getRoundMatches - round 2", () => {
		it("should return current matches of the round with 200", async () => {
			const mockData = {
				round: 1,
				matches: [
					{
						id: "d8f09d33-2e4e-409a-9a4c-4431de5d5a54",
						round: 1,
						result: null,
						createdAt: new Date("2026-03-22T12:34:59.275Z"),
						updatedAt: new Date("2026-03-22T12:34:59.275Z"),
						tournamentId: 1,
						whitePlayerId: "ff553b65-33c8-4346-9a32-b48aa1d8e2b2",
						blackPlayerId: "f484e2d3-e0c0-4fb2-9608-b19799428dea",
						whitePlayer: {
							id: "ff553b65-33c8-4346-9a32-b48aa1d8e2b2",
							username: "joueur6",
							email: "joueur6@user.local",
							password:
								"$2b$13$N9wHWfoiCrp0//hOpoJY3uJwxFOAV8BptozC2FgeC92tawhl6OLrq",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:49.290Z"),
							updatedAt: new Date("2026-03-22T12:22:49.290Z"),
						},
						blackPlayer: {
							id: "f484e2d3-e0c0-4fb2-9608-b19799428dea",
							username: "joueur2",
							email: "joueur2@user.local",
							password:
								"$2b$13$XzNvOx8k2Oqz3a8Rh2Gj8eJmT8GQQsO7KLM3L5ZHV3YlS/tES1kL2",
							birthdate: "1995-10-20",
							gender: "F",
							elo: 1600,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:46.964Z"),
							updatedAt: new Date("2026-03-22T12:22:46.964Z"),
						},
					},
					{
						id: "703eec15-3510-44d4-b7f4-7c90d15e8163",
						round: 1,
						result: null,
						createdAt: new Date("2026-03-22T12:34:59.275Z"),
						updatedAt: new Date("2026-03-22T12:34:59.275Z"),
						tournamentId: 1,
						whitePlayerId: "47f42555-17c6-44f6-9e53-87a2c351e26a",
						blackPlayerId: "30a5de51-ad99-404a-b778-283d826d0de5",
						whitePlayer: {
							id: "47f42555-17c6-44f6-9e53-87a2c351e26a",
							username: "joueur1",
							email: "joueur1@user.local",
							password:
								"$2b$13$pQV3KNhulBmXcJhLsM7TS.LE58wRSvlHob8XG9VptZX6UKtYjVXW6",
							birthdate: "1990-05-15",
							gender: "M",
							elo: 1200,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:46.333Z"),
							updatedAt: new Date("2026-03-22T12:22:46.333Z"),
						},
						blackPlayer: {
							id: "30a5de51-ad99-404a-b778-283d826d0de5",
							username: "joueur3",
							email: "joueur3@user.local",
							password:
								"$2b$13$CA1MpcSvdk9scV090wjk7uTnoEeHtbYpvRfLM5IUgArKGyPDCKkQG",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:47.580Z"),
							updatedAt: new Date("2026-03-22T12:22:47.580Z"),
						},
					},
					{
						id: "0555ffb3-d0b6-4f00-bd0b-6b8d3a20420d",
						round: 1,
						result: null,
						createdAt: new Date("2026-03-22T12:34:59.275Z"),
						updatedAt: new Date("2026-03-22T12:34:59.275Z"),
						tournamentId: 1,
						whitePlayerId: "ebc7fe71-4e99-4431-8508-5e6427830e55",
						blackPlayerId: "d59c771e-2396-4cc9-939a-0576b9307c7a",
						whitePlayer: {
							id: "ebc7fe71-4e99-4431-8508-5e6427830e55",
							username: "joueur4",
							email: "joueur4@user.local",
							password:
								"$2b$13$xNmNVDxVMrDi5Ip7bqBZee/TVR2p9m3daBbjufv.UJuVVFyhqwdzC",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:48.147Z"),
							updatedAt: new Date("2026-03-22T12:22:48.147Z"),
						},
						blackPlayer: {
							id: "d59c771e-2396-4cc9-939a-0576b9307c7a",
							username: "joueur5",
							email: "joueur5@user.local",
							password:
								"$2b$13$1lscUQk4Zn53GlEHw3DFquNJs05yK8wRu38ry./9TxMK8PebBECni",
							birthdate: "2010-03-10",
							gender: "M",
							elo: 1100,
							role: "user",
							createdAt: new Date("2026-03-22T12:22:48.735Z"),
							updatedAt: new Date("2026-03-22T12:22:48.735Z"),
						},
					},
				],
			};
			tournamentService.getRoundMatches.mockResolvedValue(mockData);

			const response = await request(app).get(
				"/tournament/1/matches/current-round",
			);

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveProperty("round", 1);
			expect(response.body.data.matches).toHaveLength(3);
			expect(tournamentService.getRoundMatches).toHaveBeenCalledWith(1);
		});
	});
});
