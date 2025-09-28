import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";
import ErrorHandler from "../utils/ErrorHandler";
import UserLoginDetail from "../service/UserLoginDetail";


class Memberships extends Model {
    public id!: number;
    public user_id!: number;
    public organization_id!: number;
    public role!: string;
    public created_at!: Date;
    public updated_at!: Date;
    public created_by!: number | null;
    public updated_by!: number | null;

    public static associate(Model: any) {
        Memberships.belongsTo(Model.Organization, {
            foreignKey: 'organization_id',
            targetKey: 'id',
        });
        Memberships.belongsTo(Model.User, {
            foreignKey: 'user_id',
            targetKey: 'id'
        });
    }
    /**
     * create new organization call create method and also first channel
     */

    public static async createNewOrganization(models: any, user_id: number, description: string, name: string, code: string) {
        const transactionObject = await sequelize.transaction();
        try {
            console.log(UserLoginDetail.getUserId())
            const organization = await models.Organization.create({
                name: name,
                code: code,
                description: description,
            },
                {
                    transaction: transactionObject
                }
            );

            const membership = await this.create({
                user_id: user_id,
                organization_id: organization.id,
                role: 'Admin',
            },
                {
                    transaction: transactionObject
                });

            const channel = await models.Channel.create({
                org_id: organization.id,
                name: organization.name + '_public',
                type: 'channel'
            }, {
                transaction: transactionObject
            });

            await models.ChannelMember.create({
                channel_id: channel.id,
                user_id: user_id
            }, {
                transaction: transactionObject
            });

            await transactionObject.commit();
            return {
                status: true,
                message: 'Successfully created new organization',
                organization: organization,
                membership: membership
            }

        } catch (error) {
            await transactionObject.rollback();
            const errorMessage = ErrorHandler.getMessage(error);
            return {
                status: false,
                message: errorMessage,
                organization: null,
                membership: null
            }
        }
    }
}

Memberships.init({
    id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    organization_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
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
    tableName: 'memberships',
    modelName: 'Memberships',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (memberships: Memberships) => {
            memberships.created_at = new Date();
            memberships.updated_at = new Date();
            memberships.created_by = UserLoginDetail.getUserId();
            memberships.updated_by = UserLoginDetail.getUserId();
        },
        beforeUpdate: (memberships: Memberships) => {
            memberships.updated_at = new Date();
            memberships.updated_by = UserLoginDetail.getUserId();
        }
    }
});


export default Memberships;
