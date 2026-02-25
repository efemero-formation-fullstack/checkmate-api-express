import z from "zod";

export const loginValidator = z.object({
	username: z.string().optional(),
	email: z.email().optional(),
	password: z.string(),
});
