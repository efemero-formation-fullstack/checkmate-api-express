import z from "zod";

export const createTournamentValidator = z.object({
	name: z.string().min(2).max(255),
	location: z.string().max(255).optional(),
	minPlayers: z.number().int().min(2).max(32),
	maxPlayers: z.number().int().min(2).max(32),
	minElo: z.number().int().min(0).max(3000).optional(),
	maxElo: z.number().int().min(0).max(3000).optional(),
	womenOnly: z.boolean().optional(),
	endRegistrationDate: z.iso.date(),
	categories: z.array(z.number().int()).optional(),
});
