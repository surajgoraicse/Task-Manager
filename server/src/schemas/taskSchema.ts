import { z } from "zod";

export const titleValidation = z
	.string()
	.trim()
	.max(30, "maximum length of the title is 30")
	.min(10, "minimum length of the title is 15");

export const descriptionValidation = z
	.string()
	.trim()
	.max(150, "maximum length of the title is 150")
	.min(10, "minimum length of the title is 10");
