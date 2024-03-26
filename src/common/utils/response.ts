import { Response } from "express";

export const sendJSONResponse = (res: Response, message: string, data: any, status: number = 200) => {
    res.status(status).json({
        message: message,
        data: data
    });
}