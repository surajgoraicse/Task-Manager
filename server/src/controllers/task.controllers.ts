import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";
import ApiResponse from "../utils/ApiResponse.util.js";
import {
	descriptionValidation,
	titleValidation,
} from "../schemas/taskSchema.js";
import categoryModel from "../models/category.model.js";
import SubjectModel from "../models/subject.model.js";
import TaskModel from "../models/task.model.js";

export const createTask = asyncHandler(
	async (req: AuthenticatedRequest, res: Response) => {
		/*
		 * take data from the body
		 * validate data
		 * check category
		 * check subject
		 * create task
		 */

		const { category, subject, title, description } = req.body;
		const isCompleted = req.body?.isCompleted || false;
		const user = req?.user;
		if (!user) {
			return res.status(404).json(new ApiResponse(404, false, "Unauthorized"));
		}
		if (!category || !subject || !title) {
			return res
				.status(400)
				.json(new ApiResponse(400, false, "Send data of the task"));
		}

		const validateTitle = titleValidation.safeParse(title);
		const validateDescription = descriptionValidation.safeParse(description);
		if (!validateTitle.success || !validateDescription) {
			const error =
				validateDescription.error?.format() || validateTitle.error?.format();
			return res
				.status(400)
				.json(
					new ApiResponse(400, false, "task title validation failed", error)
				);
		}

		const checkCategoryDb = await categoryModel.findOne({ name: category });
		const checkSubjectDb = await SubjectModel.findOne({ name: subject });
		const checkTitleDb = await TaskModel.findOne({ title });

		if (!checkCategoryDb || !checkSubjectDb || checkTitleDb) {
			const message =
				checkCategoryDb && checkSubjectDb
					? "Title already exist"
					: "category or subject not found";
			return res.status(400).json(new ApiResponse(400, false, message));
		}

		const createTask = await TaskModel.create({
			createdBy: user._id,
			category: checkCategoryDb._id,
			subject: checkSubjectDb._id,
			title,
			isCompleted,
			description,
		});
		if (!createTask) {
			return res
				.status(500)
				.json(
					new ApiResponse(
						500,
						false,
						"task creation failed due to server error"
					)
				);
		}
		res
			.status(201)
			.json(new ApiResponse(201, true, "task created successfully"));
	}
);
