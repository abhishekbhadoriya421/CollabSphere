import { Request, Response } from "express"
import { Op, Sequelize } from "sequelize";
import models from "../models/CentralModel";

export const SearchUserAction = async (req: Request, res: Response) => {
    const { search, ou_id } = req.query;
    if (!search || !ou_id) {
        return res.status(200).json({
            userList: [],
            status: 200,
            message: 'Empty Search'
        });
    }
    const Users = await models.User.findAll({
        attributes: [
            'username',
            'email',
            ['id', 'user_id']
        ],
        where: Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('username')),
            { [Op.like]: `%${search}%` }
        ),
        include: [
            {
                model: models.Memberships,
                attributes: [],
                where: { organization_id: ou_id }
            }
        ],
        raw: true,
    });

    return res.status(200).json({
        userList: Users,
        status: 200,
        message: 'Success'
    });

}