import { Request, Response } from "express";
import { getUserId } from "../utils/GetUserDetails";
import models from "../models/CentralModel";
import ErrorHandler from "../utils/ErrorHandler";
import Message from "../models/mongoModels/Message";

export const GetMessageByChannelIdAction = async (req: Request, res: Response) => {
    const { channelId } = req.params;
    const user_id = getUserId(req);
    if (!user_id || channelId === undefined) {
        return res.status(401).json({ message: 'Unauthorized', status: 401 });
    }

    try {
        const channel = await models.Channel.findOne({
            where: { id: channelId },
        });
        if (!channel) {
            return res.status(404).json({ message: 'Channel not found', status: 404 });
        }

        const membersOfChannel = await models.ChannelMember.findAll({
            where: { channel_id: channel.id },
            attributes: ['user_id'],
            include: [
                { model: models.User, attributes: ['id', 'username'] }
            ]
        });

        const memberIds = membersOfChannel.map((member: any) => member.user_id);
        if (!memberIds.includes(user_id)) {
            return res.status(403).json({ message: 'Forbidden: You are not a member of this channel', status: 403 });
        }

        const messages = await Message.find({ channelId: channel.id }).sort({ createdAt: -1 }).limit(20);
        const members = membersOfChannel
            .filter((member: any) => member.user_id !== user_id)
            .map((member: any) => {
                return {
                    id: member.user_id,
                    username: member.User?.username,
                }
            });

        if (channel.type === 'dm' && members.length !== 1) {
            return res.status(500).json({ message: 'Data inconsistency: DM channel should have exactly two members', status: 500 });
        }
        let channel_name = channel.name;
        let channel_type = channel.type;
        if (channel.type === 'dm') {
            channel_name = members[0].username;
            channel_type = 'dm';
        }
        return res.status(200).json(
            {
                message: 'Messages retrieved successfully',
                status: 200,
                messagesBox: messages,
                channel_name: channel_name,
                channel_type: channel_type,
                userIds: memberIds,
                members: members
            });
    }
    catch (error) {
        return res.status(500).json(
            {
                message: ErrorHandler.getMessage(error),
                status: 500
            }
        );
    }
};


export const CreateNewMessageAction = async (req: Request, res: Response) => {
    try {
        const { sender_id, content, channel_id } = req.body;
        if (!sender_id || !channel_id) {
            return res.status(404).json({
                message: 'sender id and channel id can not be null',
                status: 404
            })
        }
        const model = await Message.create({
            senderId: sender_id,
            text: content,
            channelId: channel_id
        });
        return res.status(200).json({
            message: 'message is saved',
            status: 200,
            message_id: model._id
        })
    } catch (err) {
        return res.status(500).json({
            message: ErrorHandler.getMessage(err),
            status: 500
        });
    }
}

export const GetPageOffsetAction = async (req: Request, res: Response) => {
    const pageOffset = parseInt(req.query.pageOffset as string, 10) || 0;
    const channelId = parseInt(req.query.channelId as string, 10);
    if (!pageOffset || !channelId) {
        return res.status(404).json({ message: 'Channel Id and Page of set cannot be null', status: 404, messagesBox: [] });
    }
    try {
        const messages = await Message.find({ channelId: channelId }).sort({ createdAt: -1 }).skip(pageOffset).limit(20);
        return res.status(200).json({
            message: 'successfully fetch',
            status: 200,
            messagesBox: messages
        })
    } catch (err: any) {
        return res.status(404).json({ message: ErrorHandler.getMessage(err), status: 404, messagesBox: [] });
    }
}


export const SaveUserReactionAction = async (req: Request, res: Response) => {
    try {
        const { reactor_id, message_id, channel_id, react } = req.body;
        /**
         * update the react value if reaction already exist else add reaction
         */

        const result = await Message.updateOne(
            { _id: message_id, channelId: channel_id, "reactions.reactorId": reactor_id },
            { $set: { "reactions.$.react": react } }
        );
        if (result.matchedCount === 0) { // if reaction not found create one 
            await Message.updateOne(
                { _id: message_id, channelId: channel_id },
                { $push: { reactions: { react: react, reactorId: reactor_id } } }
            )
        }
        return res.status(200).json({
            message: 'Successfully saved the reaction',
            status: 200,
        });
    } catch (err: any) {
        return res.status(404).json({
            message: ErrorHandler.getMessage(err),
            status: 404
        });
    }
}

export const DeleteUserMassage = async (req: Request, res: Response) => {
    const { message_id, channel_id, user_id } = req.body;
    try {
        await Message.deleteOne(
            { _id: message_id, channelId: channel_id, senderId: user_id }
        );
        return res.status(200).json({ message: 'Deleted Successfully', status: 200 });
    } catch (err: any) {
        return res.status(500).json({ message: ErrorHandler.getMessage(err), status: 500 });
    }

}