import { Request, Response } from "express";
import Memberships from "../models/Memberships";
import Organization from "../models/Organization";
import models from "../models/CentralModel";
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
            membership: Memberships | null
        }
        const response: CreateNewOuResponse = await Memberships.createNewOrganization(models, user_id, description, name, code);

        if (!response.status) {
            return res.status(404).json({
                status: 404,
                message: response.message,
                organization_id: null,
                membership_id: null
            });
        } else {
            return res.status(201).json({
                status: 201,
                message: "Successfully created oraganization",
                organization_id: response.organization?.id,
                membership_id: response.membership?.id
            });
        }

    } catch (error: any) {
        return res.status(404).json({
            status: 404,
            message: 'Internal Server Error'
        });
    }
}