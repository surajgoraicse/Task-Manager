import { z } from "zod";

export const categoryNameValidation = z
	.string()
	.max(20, "maximum length of categiory name is 20")
	.min(2, "minimum length of the categiory name is 2")
	.trim();


export const colorValidation = z.enum(["fff", "000"]);
