import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";
import { subjectNameValidation } from "../schemas/subjectSchema.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import SubjectModel from "../models/subject.model.js";
import categoryModel from "../models/category.model.js";

export const createSubject = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		// take data from the body
		// validate data
		// check if subject already exists
		// create a subject

		const { category, name, color } = req.body;
		const user = req.user;
		if (!user) {
			return res
				.status(500)
				.json(
					new ApiResponse(500, false, "user not found, authentication failed")
				);
		}
		if (!category || !name) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "send data of the subject"));
		}

		const validate = subjectNameValidation.safeParse(name);
		if (!validate.success) {
			return res
				.status(400)
				.json(
					new ApiResponse(
						400,
						false,
						"subject name validation failed",
						validate.error.format()
					)
				);
		}

		const checkCategoryDb = await categoryModel.findOne({ name: category });
		if (!checkCategoryDb) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "category not found"));
		}
		const setColor = subjectNameValidation.safeParse(color).success
			? color
			: "000";

		const checkSubjectDb = await SubjectModel.findOne({ name });
		if (checkSubjectDb) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "Subject already exists in db"));
		}
		const createSubject = await SubjectModel.create({
			user: user._id,
			category: checkCategoryDb._id,
			name,
			setColor,
		});
		if (!createSubject) {
			return res
				.status(500)
				.json(
					new ApiResponse(
						500,
						false,
						"Subject creation failed due to server error"
					)
				);
		}
		res
			.status(201)
			.json(
				new ApiResponse(
					201,
					true,
					"Subject created successfully",
					createSubject
				)
			);
	}
);


export const deleteSubject = asyncHandler(async ()=>{})