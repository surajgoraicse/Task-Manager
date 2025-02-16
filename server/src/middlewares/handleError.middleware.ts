import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/types.js";

const handleError = (
	err: ApiError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errorResponse: ApiError = {
		statusCode: err.statusCode || 500,
		name: err.name || "server error",
		message: err.message || "something went wrong",
		data: err.data || "",
		success: false,
		errors: err.errors || [],
	};
	console.log("Error : ", errorResponse);
	// console.log("Error stack : ", err.stack);

	res.status(errorResponse.statusCode).json(errorResponse);
};


export default handleError