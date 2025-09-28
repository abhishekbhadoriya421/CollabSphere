import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";
import Organization from "./Organization";
import ErrorHandler from "../utils/ErrorHandler";
import UserLoginDetail from "../service/UserLoginDetail";

interface CreateNewOuResponse {
    status: boolean,
    message: string,
    organization: Organization | null,
    membership: Memberships | null
}
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

    public static async createNewOrganization(user_id: number, description: string, name: string, code: string): Promise<CreateNewOuResponse> {
        const transactionObject = await sequelize.transaction();
        try {
            const organization = await Organization.create({
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
        allowNull: false,
        defaultValue: UserLoginDetail.getUserId()
    },
    updated_by: {
        type: DataTypes.NUMBER,
        allowNull: false,
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
        },
        beforeUpdate: (memberships: Memberships) => {
            memberships.updated_at = new Date();
            memberships.updated_by = UserLoginDetail.getUserId();
        }
    }
});


export default Memberships;
