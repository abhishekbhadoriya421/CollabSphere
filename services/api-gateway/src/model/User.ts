import sequelize from "../config/sqldb";
import { DataTypes, Model, Optional } from "sequelize";

class User extends Model {
    public id!: number;
    public email!: string;
    public password_hash!: string
    public username!: string;
    public readonly createdAt!: Date
    public readonly updatedAt!: Date
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    sequelize,
    tableName: 'users',
    modelName: 'User'
});


export default User;