import z from "zod";

export const loginValidator = z.object({
	login: z.string().optional(),
	password: z.string(),
});
