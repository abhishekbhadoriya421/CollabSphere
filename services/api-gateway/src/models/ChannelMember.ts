import sequelize from "../config/sqldb";
import { DataTypes, Model, } from "sequelize";
import { ValidationError } from "sequelize";

class ChannelMember extends Model {
    public id!: number;
    public channel_id!: number;
    public user_id!: number;
    public joined_at!: number;
    public created_at!: Date;
    public updated_at!: Date;
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
    tableName: 'channels',
    modelName: 'Channel',
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