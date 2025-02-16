import { z } from "zod";

export const usernameValidation = z
	.string()
	.min(4, "username must contain atleast 4 charaters")
	.max(20, "username must not contain more than 20 characters")
	.regex(/^[a-zA-Z0-9\s]*$/, "username must not contain special characters")
	.trim();

export const userValidation = z.object({
	username: usernameValidation,
	email: z.string().email(),
	password: z.string().min(8).max(20),
	fullname: z.string().toLowerCase(),
});
