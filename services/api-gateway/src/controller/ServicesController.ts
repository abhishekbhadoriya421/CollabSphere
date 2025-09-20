import { Request, Response } from 'express';
import Activities from '../models/Activities';
import ErrorHandler from '../utils/ErrorHandler';
export const GetActivityAction = async (req: Request, res: Response) => {
    try {
        const activities = await Activities.findAll();
        return res.json({
            message: 'Fetch Activites',
            activities: activities
        });
    } catch (error) {
        return res.status(500).json({
            message: ErrorHandler.getMessage(error),
            activities: []
        })
    }
}