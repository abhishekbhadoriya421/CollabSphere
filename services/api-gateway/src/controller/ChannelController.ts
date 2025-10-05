import ErrorHandler from "../utils/ErrorHandler"
import { Request, Response } from "express";
import User from '../models/User';
import models from "../models/CentralModel";
import { getUserId } from '../utils/GetUserDetails';



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
        console.log(channel)
        return res.status(200).json({
            message: 'successfully fetch all channels',
            status: 200,
            channel: channel
        })

    } catch (error) {
        const errorMessage = ErrorHandler.getMessage(error);
        return res.status(500).json({
            message: errorMessage,
            status: 500,
            channel: []
        })
    }
}


export const GetDmChannel = async (req: Request, res: Response) => {
    const { target_user_id } = req.params;
    if (!target_user_id) {
        return res.status(404).json({
            message: 'Target user id not found',
            id: null,
            type: 'none',
            name: '',
            created_by: null
        });
    }
    const target = Number(target_user_id);
    const user_id = getUserId(req);
    const targetUserObject = await models.User.findOne({
        where: { id: target }
    });

    if (!targetUserObject) {
        return res.status(404).json({
            message: 'Target user account not found',
            id: null,
            type: 'none',
            name: '',
            created_by: null
        });
    }
    let errorMessage = '';
    const response = await models.Channel.getDmChannel(user_id, target, targetUserObject);
    if (response.status) {
        if (response.channel) {
            return res.status(200).json({
                message: 'Channel Created Successfully',
                id: response.channel.id,
                type: models.Channel.DM_CHANNEL,
                name: response.channel.name,
                created_by: response.channel.created_by
            });
        } else {
            errorMessage = 'Something went wrong channel couldn\'t be created'
        }

    } else {
        errorMessage = response.message
    }
    return res.status(404).json({
        message: errorMessage,
        id: null,
        type: 'none',
        name: '',
        created_by: null
    });

}