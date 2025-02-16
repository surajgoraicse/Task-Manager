import { NextFunction, Request, Response } from "express";
import { IUser } from "../models/user.model.js";


// Refractor this later
export interface ApiError extends Error {
	statusCode: number;
	success: boolean;
	data: any;
	errors: string[] | string | Error;
}

export type ControllerType = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<any>;

export interface AuthenticatedRequest extends Request {
	user?: IUser;
}

