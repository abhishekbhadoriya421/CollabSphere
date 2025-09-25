import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";


class Roles extends Model {
    public name!: string;
    public organization_id!: number;
    public description!: string;
    public created_at!: Date
    public updated_at!: Date
}

Roles.init({
    name: {
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
    organization_id: {
        type: DataTypes.NUMBER,
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
    tableName: 'user_roles',
    modelName: 'Roles',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (user_roles: Roles) => {
            user_roles.created_at = new Date();
            user_roles.updated_at = new Date();
        },
        beforeUpdate: (user_roles: Roles) => {
            user_roles.updated_at = new Date();
        }
    }
});

export default Roles;