import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import {
	categoryNameValidation,
	colorValidation,
} from "../schemas/categorySchema.js";
import categoryModel from "../models/category.model.js";

export const createCategory = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		// a user will send req to create a category
		// take the req body and validate the category
		// check if it already exists
		// if not exist then create one

		const { name, color } = req.body;
		const user = req.user;
		if (!user) {
			return res.status(401).json(new ApiResponse(401, false, "Unauthorized "));
		}
		const validate = categoryNameValidation.safeParse(name);
		const validateColor = colorValidation.safeParse(color);
		const categoryColor = validateColor?.success ? color : "000";
		if (!validate.success) {
			return res
				.status(404)
				.json(
					new ApiResponse(
						404,
						false,
						"invalid category name ",
						validate.error.format()
					)
				);
		}

		const dbCategory = await categoryModel.findOne({ name });
		if (dbCategory) {
			return res
				.status(404)
				.json(new ApiResponse(400, false, "category already exist in db"));
		}

		const create = await categoryModel.create({
			name,
			color: categoryColor,
			createdBy: user._id,
		});
		if (!create) {
			return res
				.status(500)
				.json(
					new ApiResponse(
						500,
						false,
						"category creation failed due to server error"
					)
				);
		}

		res
			.status(201)
			.json(
				new ApiResponse(201, true, "category created successfully", create)
			);
	}
);
