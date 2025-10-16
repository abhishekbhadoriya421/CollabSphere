import { Request, Response } from "express";
import { getUserId } from "../utils/GetUserDetails";
import models from "../models/CentralModel";
import ErrorHandler from "../utils/ErrorHandler";
import Message from "../models/mongoModels/Message";

export const GetMessageByChannelIdAction = async (req: Request, res: Response) => {
    const { channelId } = req.params;
    console.log('Channel ID from params:', channelId);
    const user_id = getUserId(req);
    console.log('Authenticated User ID:', user_id);
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
        console.error('Error fetching messages:', error);
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