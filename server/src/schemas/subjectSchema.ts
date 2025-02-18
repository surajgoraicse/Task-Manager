import { z } from "zod";

export const subjectNameValidation = z
	.string()
	.max(20, "maximum length of subject name is 20")
	.min(2, "minimum length of the subject name is 2")
	.trim();

export const subjectColorValidation = z.enum(["fff", "000"]);
	