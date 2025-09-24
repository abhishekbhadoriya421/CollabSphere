import sequelize from "../config/sqldb";
import { DataTypes, Model, } from "sequelize";
import { ValidationError } from "sequelize";
import models from './CentralModel';

class ChannelMember extends Model {
    public id!: number;
    public channel_id!: number;
    public user_id!: number;
    public joined_at!: number;
    public created_at!: Date;
    public updated_at!: Date;

    public static associate(Model: any) {
        ChannelMember.belongsTo(Model.User, {
            foreignKey: 'user_id',
            targetKey: 'id',
        });
        ChannelMember.belongsTo(Model.Channel, {
            foreignKey: 'channel_id',
            targetKey: 'id',
        });
    }

    public static async getChannelByUserId(user_id: number) {
        const channelData = await ChannelMember.findAll({
            where: { user_id: user_id },
            include: [
                {
                    model: models.User, attributes: ['id', 'username', 'email'], required: false
                },
                {
                    model: models.Channel, attributes: ['org_id', 'name', 'type', 'created_by', 'created_at'], required: false
                }
            ],
            attributes: ['user_id', 'joined_at', 'id']
        });

        if (!channelData) {
            return null;
        } else {
            return channelData;
        }
    }
}

ChannelMember.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    channel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    joined_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    }
}, {
    sequelize,
    tableName: 'channel_members',
    modelName: 'ChannelMember',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (channelM: ChannelMember) => {
            channelM.created_at = new Date();
            channelM.updated_at = new Date();
        },
        beforeUpdate: (channelM: ChannelMember) => {
            channelM.updated_at = new Date();
        }
    }
});


export default ChannelMember;