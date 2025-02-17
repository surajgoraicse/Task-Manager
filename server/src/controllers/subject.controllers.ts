import { Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { AuthenticatedRequest } from "../utils/types.js";

export const createSubject = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
        
    }
);
