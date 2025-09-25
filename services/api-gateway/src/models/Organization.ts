import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";


class Organization extends Model {
    public id!: number;
    public code!: string;
    public description!: string;
    public name!: string;
    public created_at!: Date
    public updated_at!: Date
}


Organization.init({
    id: {
        type: DataTypes.NUMBER,
        allowNull: false,
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
        },
        beforeUpdate: (organization: Organization) => {
            organization.updated_at = new Date();
        }
    }
});

export default Organization;