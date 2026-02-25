import z from "zod";

export const createTournamentValidator = z.object({
	name: z.string().min(2).max(255),
	location: z.string().max(255).optional(),
	minPlayers: z.coerce.number().int().min(2).max(32),
	maxPlayers: z.coerce.number().int().min(2).max(32),
	minElo: z.coerce.number().int().min(0).max(3000).optional(),
	maxElo: z.coerce.number().int().min(0).max(3000).optional(),
	womenOnly: z.boolean().optional(),
	endRegistrationDate: z.iso.date(),
	categories: z.array(z.coerce.number().int()).optional(),
});

export const getAllTournamentsValidator = z.object({
	// Filters
	name: z.string().min(2).max(255).optional().catch(null),
	location: z.string().max(255).optional().catch(null),
	minElo: z.coerce.number().int().min(0).max(3000).optional().catch(null),
	maxElo: z.coerce.number().int().min(0).max(3000).optional().catch(null),
	fitElo: z.coerce.number().int().min(0).max(3000).optional().catch(null),
	womenOnly: z.stringbool().optional().catch(null),
	fromDate: z.iso.date().optional().catch(null),

	// Pagination
	offset: z.coerce.number().int().min(0).optional().default(0).catch(0),
	limit: z.coerce
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.default(20)
		.catch(20),

	// Sorting
	sortBy: z
		.enum([
			"name",
			"location",
			"minElo",
			"maxElo",
			"endRegistrationDate",
			"nbOfPlayers",
		])
		.optional()
		.catch("endRegistrationDate"),
	sortOrder: z.enum(["asc", "desc"]).optional().catch("asc"),
});

export const registerTournamentValidator = z.object({
	memberId: z.uuid(),
});
