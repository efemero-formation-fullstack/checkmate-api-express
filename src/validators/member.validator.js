import z from "zod";

export const registerValidator = z.object({
	username: z.string().min(3).max(20),
	email: z.email(),
	password: z.string().min(6).max(100),
	birthdate: z.iso.date(),
	gender: z.enum(["M", "F", "O"]),
	elo: z.number().int().min(0).max(3000).optional(),
});
