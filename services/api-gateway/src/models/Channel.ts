import sequelize from "../config/sqldb";
import { DataTypes, Model, } from "sequelize";
import { ValidationError } from "sequelize";

class Channel extends Model {
    public id!: number;
    public org_id!: string;
    public name!: string;
    public type!: 'channel' | 'dm' | 'group';
    public created_by!: number;
    public created_at!: Date;
    public updated_at!: Date;
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
        beforeCreate: (channel: Channel) => {
            channel.created_at = new Date();
            channel.updated_at = new Date();
        },
        beforeUpdate: (channel: Channel) => {
            channel.updated_at = new Date();
        }
    }
});


export default Channel;