import { Request, Response } from "express";
import Memberships from "../models/Memberships";
import Organization from "../models/Organization";
import models, { sequelize } from "../models/CentralModel";
import Channel from "../models/Channel";
import ChannelMember from "../models/ChannelMember";
import { getUserId } from "../utils/GetUserDetails";
import ErrorHandler from "../utils/ErrorHandler";

export const createOrganizationAction = async (req: Request, res: Response) => {
    try {
        const { user_id, description, name, code } = req.body;
        if (!user_id || !name || !code) {
            return res.status(404).json({
                status: 404,
                message: 'Name and code are required',
                organization_id: null,
                membership_id: null
            });
        }

        const alreadyMapped = await Memberships.findOne({ where: { user_id: user_id } });
        if (alreadyMapped) {
            return res.status(404).json({
                status: 409,
                message: 'This account is already mapped with an organization',
                organization_id: null,
                membership_id: null
            });
        }
        interface CreateNewOuResponse {
            status: boolean,
            message: string,
            organization: Organization | null,
            membership: Memberships | null,
            channel: Channel | null,
            channelMembership: ChannelMember | null
        }
        const response: CreateNewOuResponse = await Memberships.createNewOrganization(models, user_id, description, name, code);

        if (!response.status) {
            return res.status(404).json({
                status: 404,
                message: response.message,
                organization: null,
                membership: null,
                channel: null,
                channelMembership: null
            });
        } else {
            return res.status(201).json({
                status: 201,
                message: "Successfully created oraganization",
                organization: response.organization,
                membership: response.membership,
                channel: response.channel,
                channelMembership: response.channelMembership
            });
        }

    } catch (error: any) {
        return res.status(404).json({
            status: 404,
            message: 'Internal Server Error',
            organization: null,
            membership: null,
            channel: null,
            channelMembership: null
        });
    }
}

export const getOrganizationAction = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const getOrganizarion = await Organization.getOrganizationDetailByUserId(userId);
    return res.status(200).json({
        status: 200,
        message: 'Successfully Fetch',
        organization: getOrganizarion.ourganization,
        membership: getOrganizarion.membership,
        user_role: getOrganizarion.role
    });
}


export const addUserAction = async (req: Request, res: Response) => {
    const { email, role } = req.body;
    const user_id = getUserId(req);
    const validRoles = ['Admin', 'Guest', 'Member'] as const;
    if (!validRoles.includes(role)) {
        return res.status(404).json({
            status: 404,
            message: `Invalid Request`,
            membership: null
        });
    }
    const user = await models.Memberships.findOne({
        where: { user_id: user_id }
    });
    if (!user) {
        return res.status(404).json({
            status: 404,
            message: `Invalid Request`,
            membership: null
        });
    }

    if (user.role !== 'Admin') {
        return res.status(403).json({
            status: 403,
            message: `You are not allowed to perform this action`,
            membership: null
        });
    }
    const targetUser = await models.User.findOne({
        where: { email: email },
        attributes: ['id']
    });

    if (!targetUser) {
        return res.status(404).json({
            status: 404,
            message: `User login not found with ${email} email account`,
            membership: null
        });
    }

    const memberAlreadyExist = await models.Memberships.findOne({
        where: { user_id: targetUser.id }
    });

    if (!memberAlreadyExist) {
        const transactionObject = await sequelize.transaction();
        try {
            /**
             * Get Public Channel
             */

            const channel = await models.ChannelMember.findOne({
                where: {
                    user_id: user_id
                },
                include: [
                    { model: models.Channel, where: { type: 'channel' } }
                ],
                attributes: ['channel_id']
            });
            if (channel) {
                await models.ChannelMember.create({
                    user_id: targetUser.id,
                    channel_id: channel.channel_id
                }, {
                    transaction: transactionObject
                })
            }
            const model = await models.Memberships.create({
                user_id: targetUser.id,
                organization_id: user.organization_id,
                role: role
            }, {
                transaction: transactionObject
            });
            await transactionObject.commit();
            return res.status(200).json({
                status: 200,
                message: 'User add successfully',
                membership: model
            });
        } catch (err: unknown) {
            transactionObject.rollback();
            return res.status(500).json({
                status: 500,
                message: ErrorHandler.getMessage(err),
                membership: null
            });
        }
    } else {
        return res.status(409).json({
            status: 409,
            message: `User with email {${email}} already has membership`,
            membership: null
        })
    }
}


export const deleteUserAction = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    try {
        const admin_user_id = getUserId(req);

        const user = await models.Memberships.findOne({
            where: { user_id: admin_user_id }
        });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: `Invalid Request`,
                membership: null
            });
        }

        if (user.role !== 'Admin') {
            return res.status(403).json({
                status: 403,
                message: `You are not allowed to perform this action`,
                membership: null
            });
        }

        await models.Memberships.destroy({
            where: { user_id: user_id }
        });
        return res.status(200).json({
            status: 200,
            message: 'Successfully deleted the user'
        })
    } catch (err: any) {
        return res.status(500).json({
            status: 500,
            message: ErrorHandler.getMessage(err)
        })
    }

}