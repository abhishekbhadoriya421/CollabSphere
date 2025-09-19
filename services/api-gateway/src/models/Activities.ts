import sequelize from "../config/sqldb";
import { DataTypes, Model } from "sequelize";
import { ValidationError } from "sequelize";

class Activities extends Model {
    public id!: number;
    public icon_class!: string;
    public content!: string;
    public is_active!: 'ACTIVE' | 'IN-ACTIVE';
    public created_at!: Date
    public updated_at!: Date
}

Activities.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,

    },
    icon_class: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notEmpty: true
        }
    },
    content: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_active: {
        type: DataTypes.ENUM('ACTIVE', 'IN-ACTIVE'),
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
    tableName: 'activity_item',
    modelName: 'Activities',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        beforeCreate: (user: Activities) => {
            user.created_at = new Date();
            user.updated_at = new Date();
        },
        beforeUpdate: (user: Activities) => {
            user.updated_at = new Date();
        }
    }
});


export default Activities;