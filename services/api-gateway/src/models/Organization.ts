import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";
import UserLoginDetail from "../service/UserLoginDetail";
import models from './CentralModel'
import ErrorHandler from "../utils/ErrorHandler";

class Organization extends Model {
    public id!: number;
    public code!: string;
    public description!: string;
    public name!: string;
    public created_at!: Date
    public updated_at!: Date
    public created_by!: number | null;
    public updated_by!: number | null;

    public static associate(Model: any) {
        Organization.hasMany(Model.Memberships, {
            foreignKey: 'organization_id',
            sourceKey: 'id',
        });
    }

    public static async getOrganizationDetailByUserId(user_id: number) {
        try {
            const membershipModel = await models.Memberships.findOne({
                where: { user_id: user_id },
                include: [
                    { model: models.Organization }
                ]
            });

            if (!membershipModel) {
                return {
                    status: false,
                    ourganization: null,
                    membership: null
                };

            }
            if (membershipModel.role == 'Admin') {
                const allMembershipModel = await models.Memberships.findAll({
                    where: { organization_id: membershipModel.organization_id }
                });
                return {
                    status: true,
                    ourganization: (membershipModel as any).Organization,
                    membership: allMembershipModel
                }
            } else {
                return {
                    status: true,
                    ourganization: (membershipModel as any).Organization,
                    membership: membershipModel
                }
            }
        } catch (err: any) {
            const errorStr = ErrorHandler.getMessage(err);
            console.log(errorStr);
            return {
                status: false,
                ourganization: null,
                membership: null
            }
        }

    }
}


Organization.init({
    id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    created_by: {
        type: DataTypes.NUMBER,
        allowNull: true,
        defaultValue: UserLoginDetail.getUserId()
    },
    updated_by: {
        type: DataTypes.NUMBER,
        allowNull: true,
        defaultValue: UserLoginDetail.getUserId()
    }
}, {
    sequelize,
    tableName: 'organizations',
    modelName: 'Organization',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (organization: Organization) => {
            organization.created_at = new Date();
            organization.updated_at = new Date();
            organization.created_by = UserLoginDetail.getUserId();
            organization.updated_by = UserLoginDetail.getUserId();
        },
        beforeUpdate: (organization: Organization) => {
            organization.updated_at = new Date();
            organization.updated_by = UserLoginDetail.getUserId();
        }
    }
});

export default Organization;