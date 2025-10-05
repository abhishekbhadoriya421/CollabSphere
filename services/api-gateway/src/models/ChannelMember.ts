import sequelize from "../config/sqldb";
import { DataTypes, Model, QueryTypes, } from "sequelize";
import models from './CentralModel';
import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";

class ChannelMember extends Model {
    public id!: number;
    public channel_id!: number;
    public user_id!: number;
    public joined_at!: Date;
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
    /**
     * return channels created by user
     */
    public static async getChannelByUserId(user_id: number) {
        const channelData = await sequelize.query(
            `SELECT 
                d.channel_id,
                d.channel_name,
                d.channel_type,
                d.created_by,
                cm.user_id AS member_user_id,
                u.username AS member_username
            FROM (
                SELECT 
                    c.id AS channel_id,
                    c.name AS channel_name,
                    c.type AS channel_type,
                    c.created_by
                FROM channels c
                INNER JOIN channel_members cm 
                    ON cm.channel_id = c.id
                WHERE cm.user_id = $userId
            ) AS d
            INNER JOIN channel_members cm 
                ON cm.channel_id = d.channel_id
            INNER JOIN users u 
                ON u.id = cm.user_id
            WHERE cm.user_id <> $userId;
            `, {
            bind: { userId: user_id },
            type: QueryTypes.SELECT,
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
        type: DataTypes.DATE,
        allowNull: true,
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