import ErrorHandler from "../utils/ErrorHandler"
import { Request, Response } from "express";
import User from '../models/User';
import models from "../models/CentralModel";




export const GetChannelsByIdAction = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            return res.status(401).json({
                message: 'Invalid Request',
                status: 401,
                channel: []
            })
        }

        const UserObject = await User.getUserDetailsById(user_id);
        if (!UserObject) {
            return res.status(404).json({
                message: 'User Not Found',
                status: 404,
                channel: []
            });
        }

        const channel = await models.ChannelMember.getChannelByUserId(user_id);
        return res.status(200).json({
            message: 'successfully fetch all channels',
            status: 200,
            channel: channel
        })

    } catch (error) {
        console.log(error)
        const errorMessage = ErrorHandler.getMessage(error);
        return res.status(500).json({
            message: errorMessage,
            status: 500,
            channel: []
        })
    }
}