import sequelize from "../config/sqldb";
import { DataTypes, Model, } from "sequelize";
import UserLoginDetail from "../service/UserLoginDetail";
import models from "./CentralModel";
import ErrorHandler from "../utils/ErrorHandler";
import User from "./User";

class Channel extends Model {
    public id!: number;
    public org_id!: string;
    public name!: string;
    public type!: 'channel' | 'dm' | 'group';
    public created_by!: number | null;
    public created_at!: Date;
    public updated_at!: Date;


    static readonly DM_CHANNEL = 'dm';
    static readonly GROUP_CHANNEL = 'group';
    static readonly NORMAL_CHANNEL = 'channel';
    public static associate(Model: any) {
        Channel.hasMany(Model.ChannelMember, { foreignKey: 'channel_id', sourceKey: 'id' });
        Channel.hasMany(Model.ChannelMember, { as: 'member1', foreignKey: 'channel_id', sourceKey: 'id' });
        Channel.hasMany(Model.ChannelMember, { as: 'member2', foreignKey: 'channel_id', sourceKey: 'id' });

    }

    /**
     * Find Dm Channel in between user's if exist fetch and create new channel and add both
     */
    public static async getDmChannel(user_id: number, target_user_id: number, target_user_object: User) {
        const channel = await models.Channel.findOne({
            attributes: ['id', 'name', 'type', 'created_by'],
            where: { type: this.DM_CHANNEL },
            include: [
                { model: models.ChannelMember, as: 'member1', attributes: [], where: { user_id: target_user_id } },
                { model: models.ChannelMember, as: 'member2', attributes: [], where: { user_id: user_id } }
            ],
            raw: true
        });

        if (!channel) {
            const ouObject = await models.Memberships.findOne({
                attributes: ['organization_id'],
                where: { user_id: user_id }
            });
            if (ouObject) {
                const transactionObject = await sequelize.transaction();

                try {
                    const newChannel = await models.Channel.create({
                        org_id: ouObject.organization_id,
                        name: target_user_object.username,
                        type: this.DM_CHANNEL,
                        created_by: user_id
                    }, {
                        transaction: transactionObject
                    });
                    await models.ChannelMember.create({
                        channel_id: newChannel.id,
                        user_id: user_id,
                    }, {
                        transaction: transactionObject
                    });

                    await models.ChannelMember.create({
                        channel_id: newChannel.id,
                        user_id: target_user_id
                    }, {
                        transaction: transactionObject
                    });

                    transactionObject.commit();
                    return {
                        status: true,
                        message: 'successfully created',
                        channel: newChannel
                    }
                } catch (err: any) {
                    transactionObject.rollback();
                    return {
                        status: false,
                        message: ErrorHandler.getMessage(err),
                        channel: null
                    }
                }
            } else {
                return {
                    status: false,
                    message: 'Organization object not found',
                    channel: null
                }
            }
        } else {
            return {
                status: true,
                message: 'successfully created',
                channel: channel
            }
        }
    }
}

Channel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    org_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('channel', 'dm', 'group'),
        allowNull: false,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: UserLoginDetail.getUserId()
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
        beforeCreate: (channel: Channel) => {
            channel.created_at = new Date();
            channel.updated_at = new Date();
            channel.created_by = UserLoginDetail.getUserId()
        },
        beforeUpdate: (channel: Channel) => {
            channel.updated_at = new Date();
        }
    }
});


export default Channel;